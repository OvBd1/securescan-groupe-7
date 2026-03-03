import simpleGit from 'simple-git';
import { exec } from 'child_process';
import { rm, mkdir } from 'fs/promises';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const git = simpleGit();

export const analyzeRepo = async (repoPath) => {
  console.log('Analyzing repo:', repoPath);

  const tempDir = path.join(__dirname, '/../storage/temp-repos');
  console.log('tempDir', tempDir);

  const repoId = Date.now();
  console.log('repoId', repoId);

  const clonedRepoDir = path.join(tempDir, `r-${repoId}`);
  console.log('clonedRepoDir', clonedRepoDir);

  const resultsDir = path.join(__dirname, '/../storage/uploads');
  console.log('resultsDir', resultsDir);

  const resultsFile = path.join(resultsDir, `scan-results-${repoId}.json`);
  console.log('resultsFile', resultsFile);

  try {
    // Créer les répertoires s'ils n'existent pas
    await mkdir(tempDir, { recursive: true });
    await mkdir(resultsDir, { recursive: true });

    console.log(`Clonage du repo dans ${clonedRepoDir}...`);
    await git.clone(repoPath, clonedRepoDir, ['--depth', '1', '--config', 'core.longpaths=true']);

    console.log('Analyse du repo...');  
    await new Promise((resolve, reject) => {
      exec(`semgrep --config auto --json .`, {
        cwd: clonedRepoDir,
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 50,
        env: {
          ...process.env,
          PYTHONUTF8: '1',
          PYTHONIOENCODING: 'utf-8',
          LANG: 'C.UTF-8'
        }
      }, (error, stdout, stderr) => {
        if (error) return reject(error);

        console.log(stdout);
        console.error(stderr);

        // Sauvegarder les résultats
        writeFileSync(resultsFile, stdout);
        console.log(`Résultats sauvegardés dans ${resultsFile}`);

        resolve(stdout);
      });
    });

    return resultsFile;
  } catch (error) {
    console.error('Erreur lors de l\'analyse du repo:', error);
    throw error;
  } finally {
    // Supprimer seulement le dossier cloné
    await rm(clonedRepoDir, { recursive: true, force: true });
    console.log('Nettoyage du repo cloné terminé.');
  }
};