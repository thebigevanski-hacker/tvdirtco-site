/**
 * Vercel Speed Insights Initialization
 * This script initializes Vercel Speed Insights for tracking web vitals
 */
import { injectSpeedInsights } from './speed-insights.js';

// Initialize Speed Insights when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectSpeedInsights();
  });
} else {
  injectSpeedInsights();
}
