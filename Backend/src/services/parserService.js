import { readFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.config.js';

export const parseResults = async (filePath, projectId, userId) => {
  try {
    // const [existingOwasp] = await db.query('SELECT * FROM owasp');
    // if (existingOwasp.length === 0) {
    //   return {};
    // }

    // console.log(existingOwasp);

    const fileContent = await readFile(filePath, 'utf-8');
    const scanResults = JSON.parse(fileContent);

    // Mapper la sévérité Semgrep vers notre enum
    const severityMap = {
      'ERROR': 'HIGH',
      'WARNING': 'MEDIUM',
      'INFO': 'LOW',
    };

    const vulnerabilities = [];
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;

    // Parser les résultats Semgrep
    if (scanResults.results && Array.isArray(scanResults.results)) {
      for (const result of scanResults.results) {
        const severity = severityMap[result.extra.severity];
        
        // Compter pour le score global
        if (severity === 'HIGH') highCount++;
        else if (severity === 'MEDIUM') mediumCount++;
        else lowCount++;

        vulnerabilities.push({
          id: uuidv4(),
          projet_id: projectId,
          owasp_id: null, // À mapper manuellement après si nécessaire
          outil: 'semgrep',
          check_id: result.check_id,
          path: result.path,
          line: result.start?.line || 0,
          severity,
          message: result.message,
          code_snippet: result.extra?.lines || null,
          is_fixed: 0
        });
      }
    }

    // Calculer le score global (sur 100)
    // Formule simple : soustraire des points pour chaque vulnérabilité
    const globalScore = Math.max(0, 100 - (highCount * 10 + mediumCount * 5 + lowCount * 2));

    return {
      projet: {
        id: projectId,
        user_id: userId,
        global_score: globalScore,
        scan_at: new Date()
      },
      vulnerabilities,
      stats: {
        total: vulnerabilities.length,
        high: highCount,
        medium: mediumCount,
        low: lowCount
      }
    };
  } catch (error) {
    console.error('Erreur lors du parsing des résultats:', error);
    throw error;
  }
};

