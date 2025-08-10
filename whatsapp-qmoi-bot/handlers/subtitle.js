 
import askQmoi from '../services/qmoi';

async function generateSubtitles(mediaPath) {
    // Send media to Qmoi for subtitle generation
    return await askQmoi({ type: 'subtitle', mediaPath });
}

module.exports = generateSubtitles;
