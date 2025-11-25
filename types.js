/**
 * Represents the scoring breakdown for a research paper.
 * @typedef {object} PaperScores
 * @property {number} novelty - Score out of 10.
 * @property {number} methodology - Score out of 10.
 * @property {number} clarity - Score out of 10.
 * @property {number} significance - Score out of 10.
 * @property {number} citations - Score out of 10.
 */
class PaperScores {
    constructor(novelty, methodology, clarity, significance, citations) {
        this.novelty = novelty;
        this.methodology = methodology;
        this.clarity = clarity;
        this.significance = significance;
        this.citations = citations;
    }
}

/**
 * @typedef {'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject'} Decision
 */

/**
 * Represents the comprehensive review data generated for a research paper.
 */
class ReviewData {
    /**
     * @param {string} title
     * @param {string[]} authors
     * @param {string} summary
     * @param {PaperScores} scores
     * @param {string[]} strengths
     * @param {string[]} weaknesses
     * @param {string} detailedFeedback
     * @param {Decision} decision
     */
    constructor(title, authors, summary, scores, strengths, weaknesses, detailedFeedback, decision) {
        this.title = title;
        this.authors = authors;
        this.summary = summary;
        this.scores = scores;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.detailedFeedback = detailedFeedback;
        this.decision = decision;
    }
}

/**
 * Represents a single message in the chat interface.
 * Note: This remains a JSDoc type as it's typically used internally by the Chat component, 
 * but you could convert it to a Class if required for export.
 * * To make it exportable, we define a simple Class.
 */
class ChatMessage {
    /**
     * @param {string} id
     * @param {'user' | 'model'} role
     * @param {string} text
     * @param {Date} timestamp
     */
    constructor(id, role, text, timestamp) {
        this.id = id;
        this.role = role;
        this.text = text;
        this.timestamp = timestamp;
    }
}

/**
 * Represents a file uploaded by the user, converted to a Base64 format.
 */
class UploadedFile {
    /**
     * @param {string} name
     * @param {string} type - Mime type (e.g., 'application/pdf').
     * @param {string} data - Base64 string of the file content.
     * @param {number} size - File size in bytes.
     */
    constructor(name, type, data, size) {
        this.name = name;
        this.type = type;
        this.data = data;
        this.size = size;
    }
}

/**
 * @readonly
 * @enum {string}
 * The current view state of the main application.
 */
const AppView = {
    UPLOAD: 'UPLOAD',
    ANALYZING: 'ANALYZING',
    DASHBOARD: 'DASHBOARD',
    ERROR: 'ERROR',
};

/**
 * @readonly
 * @enum {string}
 * The possible review decisions. Defined as a constant object for exportability.
 */
const Decision = {
    ACCEPT: 'Accept',
    MINOR_REVISION: 'Minor Revision',
    MAJOR_REVISION: 'Major Revision',
    REJECT: 'Reject',
};


// Exporting all the necessary classes and constants.
export { PaperScores, ReviewData, ChatMessage, UploadedFile, AppView, Decision };