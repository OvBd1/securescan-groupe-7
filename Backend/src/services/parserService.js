import { readFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import db from '../config/db.config.js';

/**
 * Extrait le nom OWASP d'une chaîne de référence
 * Exemple: "A05:2025 - Injection" -> "Injection"
 */
const extractOwaspName = (owaspReference) => {
  const match = owaspReference.match(/\s-\s(.+)$/);
  return match ? match[1].trim() : null;
};

/**
 * Récupère l'ID OWASP en fonction du nom de la vulnérabilité
 */
const getOwaspIdByName = async (owaspName) => {
  try {
    const [rows] = await db.query(
      'SELECT id FROM owasp WHERE name = ?',
      [owaspName]
    );
    return rows.length > 0 ? rows[0].id : null;
  } catch (error) {
    console.error(`Erreur lors de la recherche OWASP pour ${owaspName}:`, error);
    return null;
  }
};

/**
 * Mappe les références OWASP du scan aux IDs de la base de données
 */
const mapOwaspReferences = async (owaspReferences) => {
  if (!owaspReferences || !Array.isArray(owaspReferences) || owaspReferences.length === 0) {
    return null;
  }

  // Utiliser la référence OWASP 2025 de préférence
  const owasp2025 = owaspReferences.find(ref => ref.includes('2025'));
  const selectedRef = owasp2025 || owaspReferences[0];
  
  const owaspName = extractOwaspName(selectedRef);
  if (!owaspName) return null;

  const owaspId = await getOwaspIdByName(owaspName);
  return owaspId;
};

export const parseResults = async (filePath, projectId, projectName, userId) => {
  try {
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

        // Mapper les références OWASP
        const owaspReferences = result.extra?.metadata?.owasp || [];
        const owaspId = await mapOwaspReferences(owaspReferences);

        vulnerabilities.push({
          id: uuidv4(),
          projet_id: projectId,
          owasp_id: owaspId,
          outil: 'semgrep',
          check_id: result.check_id,
          path: result.path,
          line: result.start?.line || 0,
          severity,
          message: result.extra?.message || result.check_id,
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
        name: projectName,
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

