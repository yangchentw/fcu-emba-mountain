import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const assets = [
  ['參考資料/照片/IMG20260517095426.JPG', 'public/images/hero-mountain.jpg'],
  ['參考資料/照片/IMG20260517101342.JPG', 'public/images/forest-ridge.jpg'],
  ['參考資料/照片/IMG20260314124148.JPG', 'public/images/activity-landscape.jpg'],
  ['參考資料/照片/IMG20260705112817.jpg', 'public/images/about-mountain.jpg'],
  // Keep the original 4:3 framing so the hiker and summit sign are both intact.
  ['參考資料/照片/IMG_1418.jpg', 'public/images/legacy-trail.jpg'],
  ['參考資料/照片/IMG20260517103606.JPG', 'public/images/join-ridge.jpg'],
  ['參考資料/逢甲EMBA峰鷹登山協會LOGO-02.png', 'public/images/logo.png'],
];

mkdirSync('public/images', { recursive: true });
for (const [source, output] of assets) {
  const result = source.endsWith('IMG20260314124148.JPG')
    ? spawnSync('ffmpeg', ['-y', '-i', source, '-vf', 'scale=-2:2400', '-frames:v', '1', '-update', '1', output], { stdio: 'inherit' })
    : spawnSync('sips', ['-Z', '2400', source, '--out', output], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
