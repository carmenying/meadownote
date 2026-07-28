import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN = process.env.GH_TOKEN;
const REPO = 'meadownote';
const OWNER = 'carmenying';
const PROJECT_DIR = path.resolve(__dirname, '..');

const BINARY_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.woff', '.woff2', '.ttf', '.eot', '.pdf'];

function isBinary(f) { return BINARY_EXTS.includes(path.extname(f).toLowerCase()); }

function api(method, url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const bodyStr = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: u.hostname, path: u.pathname + u.search, method,
      headers: {
        Authorization: `token ${TOKEN}`, 'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json', 'User-Agent': 'deploy-meadownote',
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
      }
    }, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(d) }); } catch { resolve({ status: res.statusCode, data: { raw: d } }); } });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function main() {
  // Create repo (public this time)
  console.log('Creating repo (public)...');
  const create = await api('POST', `https://api.github.com/user/repos`, {
    name: REPO, description: 'Meadow Note · personal podcast & blog', private: false,
  });
  if (create.status === 422) console.log('Repo already exists');
  else if (create.status === 201) console.log('Created public!');
  else console.log('Create status:', create.status, create.data.message);

  // Get current commit SHA (if any)
  let r2 = await api('GET', `https://api.github.com/repos/${OWNER}/${REPO}/git/ref/heads/main`);
  let parentSha = null;
  if (r2.status === 200) {
    parentSha = r2.data.object.sha;
    console.log(`Parent: ${parentSha}`);
  } else {
    console.log('Bootstrapping...');
    await api('PUT', `https://api.github.com/repos/${OWNER}/${REPO}/contents/README.md`, {
      message: 'init', content: Buffer.from('# Meadow Note').toString('base64'),
    });
    let r2b = await api('GET', `https://api.github.com/repos/${OWNER}/${REPO}/git/ref/heads/main`);
    if (r2b.status === 200) parentSha = r2b.data.object.sha;
  }

  // Create blobs
  const files = getAllFiles(PROJECT_DIR);
  console.log(`Creating ${files.length} blobs...`);
  const treeItems = [];
  let ok = 0;
  for (const file of files) {
    const rel = path.relative(PROJECT_DIR, file).replace(/\\/g, '/');
    let encoding = 'utf-8', content;
    if (isBinary(file)) {
      content = fs.readFileSync(file).toString('base64');
      encoding = 'base64';
    } else {
      content = fs.readFileSync(file, 'utf-8');
    }
    const r3 = await api('POST', `https://api.github.com/repos/${OWNER}/${REPO}/git/blobs`, { content, encoding });
    if (r3.data.sha) {
      treeItems.push({ path: rel, mode: '100644', type: 'blob', sha: r3.data.sha });
      ok++;
    } else {
      console.log(`  SKIP ${rel}: ${r3.data.message || ''}`);
    }
  }
  console.log(`${ok}/${files.length} blobs ok`);

  // Create tree
  console.log('Creating tree...');
  const r4 = await api('POST', `https://api.github.com/repos/${OWNER}/${REPO}/git/trees`, { tree: treeItems });
  if (!r4.data.sha) { console.error('Tree error:', r4.data.message); return; }
  const treeSha = r4.data.sha;

  // Create commit
  console.log('Creating commit...');
  const commitBody = { message: 'Initial commit: Meadow Note podcast & blog', tree: treeSha };
  if (parentSha) commitBody.parents = [parentSha];
  const r5 = await api('POST', `https://api.github.com/repos/${OWNER}/${REPO}/git/commits`, commitBody);
  if (!r5.data.sha) { console.error('Commit error:', r5.data.message); return; }
  const commitSha = r5.data.sha;

  // Update ref
  console.log('Updating ref...');
  const r6 = await api('PATCH', `https://api.github.com/repos/${OWNER}/${REPO}/git/refs/heads/main`, { sha: commitSha, force: true });
  console.log(r6.status === 200 ? 'Pushed!' : 'Push error: ' + r6.data.message);

  console.log(`\nDone! https://github.com/${OWNER}/${REPO}`);
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (['node_modules', '.git', '.next', '.turbo', 'out'].includes(entry.name)) continue;
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) getAllFiles(full, arrayOfFiles);
    else arrayOfFiles.push(full);
  }
  return arrayOfFiles;
}

main().catch(console.error);