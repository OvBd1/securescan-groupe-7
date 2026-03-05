import simpleGit from 'simple-git';
import { exec } from 'child_process';
import { rm, mkdir } from 'fs/promises';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseResults } from './parserService.js';
import { generateSecurityReport } from './pdfService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const git = simpleGit();

export const analyzeRepo = async (repoPath, projectId, projectName, userId, isZip) => {
  const tempDir = path.join(__dirname, '/../storage/temp-repos');
  const repoId = Date.now();
  const clonedRepoDir = path.join(tempDir, `r-${repoId}`);
  const resultsDir = path.join(__dirname, '/../storage/uploads');
  const resultsFile = path.join(resultsDir, `scan-results-${repoId}.json`);

  try {
    // Créer les répertoires s'ils n'existent pas
    await mkdir(tempDir, { recursive: true });
    await mkdir(resultsDir, { recursive: true });

    if (isZip) {
      // Si c'est une archive ZIP, extraire le contenu dans le dossier cloné
      console.log(`Extraction de l'archive ZIP ${repoPath} dans ${clonedRepoDir}...`);
      await mkdir(clonedRepoDir, { recursive: true });
      await new Promise((resolve, reject) => {
        exec(`unzip -o ${repoPath} -d ${clonedRepoDir}`, (error, stdout, stderr) => {
          if (error) return reject(error);
          console.log(stdout);
          console.error(stderr);
          resolve();
        });
      });
    } else {
      // Cloner le repository Git dans le dossier cloné
      console.log(`Clonage du repo dans ${clonedRepoDir}...`);
      await git.clone(repoPath, clonedRepoDir, ['--depth', '1', '--config', 'core.longpaths=true']);
    }

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

    // Parser les résultats et retourner les données structurées
    const parsedData = await parseResults(resultsFile, projectId, projectName, userId);

    const doc = generateSecurityReport(parsedData);
    doc.save(path.join(resultsDir, `security-report-${repoId}.pdf`));
    console.log(`✅ Rapport de sécurité généré : security-report-${repoId}.pdf`);
    return parsedData;
  } catch (error) {
    console.error('Erreur lors de l\'analyse du repo:', error);
    throw error;
  } finally {
    // Supprimer seulement le dossier cloné
    await rm(clonedRepoDir, { recursive: true, force: true });
    console.log('Nettoyage du repo cloné terminé.');
  }
};