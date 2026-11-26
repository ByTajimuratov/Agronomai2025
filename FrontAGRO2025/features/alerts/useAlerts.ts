
import { useState, useEffect } from 'react';

export interface DiseaseStat {
    name: string;
    value: number;
    color: string;
    severity: 'critical' | 'warning' | 'safe';
}

export interface DiseaseAlert {
    id: string;
    disease: string;
    percentage: number;
    risk: 'Critical' | 'High' | 'Medium';
    advice: string;
    action: string;
}

export const useAlerts = () => {
    // Mock Aggregated Data: "This Week's Scans in Khorezm"
    const stats: DiseaseStat[] = [
        { name: 'Un-shudring', value: 45, color: '#ef4444', severity: 'critical' }, // Red
        { name: "O'rgimchak kana", value: 30, color: '#f59e0b', severity: 'warning' }, // Amber
        { name: 'Normal', value: 25, color: '#10b981', severity: 'safe' } // Emerald
    ];

    const alerts: DiseaseAlert[] = [
        {
            id: '1',
            disease: "Un-shudring (Powdery Mildew)",
            percentage: 45,
            risk: 'Critical',
            advice: "Namlik yuqori bo'lganligi sababli zamburug' tez tarqalmoqda. Sug'orishni vaqtincha to'xtating.",
            action: "Oltingugurt (Sulfur) preparatlari bilan ishlov bering."
        },
        {
            id: '2',
            disease: "O'rgimchak kana (Spider Mite)",
            percentage: 30,
            risk: 'High',
            advice: "Barg orqasida mayda qizil nuqtalar paydo bo'lishi mumkin. Quruq va issiq havoda ko'payadi.",
            action: "Akaritsidlar (Masalan: Ortus, Nissoran) seping."
        }
    ];

    return {
        totalScans: 1240,
        stats,
        alerts,
        region: "Xorazm Viloyati"
    };
};
