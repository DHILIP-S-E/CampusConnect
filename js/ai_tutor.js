/**
 * AI Tutor Module for CampusConnect
 * Provides intelligent responses to student questions
 */

// AI Tutor knowledge base
const aiTutorKnowledge = {
    // Math topics
    "math": {
        "algebra": "Algebra is a branch of mathematics dealing with symbols and the rules for manipulating these symbols. In elementary algebra, those symbols (today written as Latin and Greek letters) represent quantities without fixed values, known as variables.",
        "calculus": "Calculus is the mathematical study of continuous change. The two major branches of calculus are differential calculus and integral calculus. Differential calculus concerns instantaneous rates of change and the slopes of curves. Integral calculus concerns accumulation of quantities and the areas under and between curves.",
        "statistics": "Statistics is the discipline that concerns the collection, organization, analysis, interpretation, and presentation of data. Statistical methods can be used to summarize or describe a collection of data; this is called descriptive statistics.",
        "trigonometry": "Trigonometry is a branch of mathematics that studies relationships between side lengths and angles of triangles. The field emerged in the Hellenistic world during the 3rd century BC from applications of geometry to astronomical studies.",
        "geometry": "Geometry is a branch of mathematics concerned with questions of shape, size, relative position of figures, and the properties of space."
    },
    
    // Programming topics
    "programming": {
        "python": "Python is an interpreted, high-level, general-purpose programming language. Its design philosophy emphasizes code readability with its use of significant whitespace. Python is dynamically typed and garbage-collected.",
        "java": "Java is a class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible. It is intended to let application developers write once, run anywhere (WORA).",
        "javascript": "JavaScript is a programming language that conforms to the ECMAScript specification. JavaScript is high-level, often just-in-time compiled, and multi-paradigm. It has curly-bracket syntax, dynamic typing, prototype-based object-orientation, and first-class functions.",
        "html": "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies such as Cascading Style Sheets (CSS) and scripting languages such as JavaScript.",
        "css": "CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in a markup language like HTML. CSS is designed to enable the separation of presentation and content, including layout, colors, and fonts."
    },
    
    // Science topics
    "science": {
        "physics": "Physics is the natural science that studies matter, its motion and behavior through space and time, and the related entities of energy and force. Physics is one of the most fundamental scientific disciplines, and its main goal is to understand how the universe behaves.",
        "chemistry": "Chemistry is the scientific discipline involved with elements and compounds composed of atoms, molecules and ions: their composition, structure, properties, behavior and the changes they undergo during a reaction with other substances.",
        "biology": "Biology is the natural science that studies life and living organisms, including their physical structure, chemical processes, molecular interactions, physiological mechanisms, development and evolution.",
        "astronomy": "Astronomy is a natural science that studies celestial objects and phenomena. It uses mathematics, physics, and chemistry in order to explain their origin and evolution.",
        "geology": "Geology is an earth science concerned with the solid Earth, the rocks of which it is composed, and the processes by which they change over time."
    },
    
    // History topics
    "history": {
        "ancient": "Ancient history refers to the time period beginning with the first records in writing, approximately 3500 BCE. It covers all continents inhabited by humans in the period 3000 BCE – 500 CE.",
        "medieval": "The Middle Ages, or Medieval Period, lasted from the 5th to the late 15th century. It began with the fall of the Western Roman Empire and merged into the Renaissance and the Age of Discovery.",
        "renaissance": "The Renaissance was a period in European history marking the transition from the Middle Ages to modernity and covering the 15th and 16th centuries. It began in Italy and spread to the rest of Europe by the 17th century.",
        "modern": "Modern history is the history of the world beginning after the Middle Ages. Generally the term 'modern history' refers to the history of the world since the advent of the Age of Reason and the Age of Enlightenment in the 17th and 18th centuries.",
        "world_wars": "The World Wars were two global conflicts that occurred in the first half of the 20th century. World War I (1914-1918) and World War II (1939-1945) involved many of the world's nations and resulted in significant political, economic, and social changes."
    },
    
    // Literature topics
    "literature": {
        "poetry": "Poetry is a form of literature that uses aesthetic and often rhythmic qualities of language—such as phonaesthetics, sound symbolism, and metre—to evoke meanings in addition to, or in place of, the prosaic ostensible meaning.",
        "fiction": "Fiction is any creative work, chiefly any narrative work, portraying individuals, events, or places in ways that are imaginary or inconsistent with history, fact, or plausibility.",
        "drama": "Drama is the specific mode of fiction represented in performance: a play, opera, mime, ballet, etc., performed in a theatre, or on radio or television.",
        "shakespeare": "William Shakespeare was an English poet, playwright, and actor, widely regarded as the greatest writer in the English language and the world's greatest dramatist. He is often called England's national poet and the 'Bard of Avon'.",
        "novels": "A novel is a relatively long work of narrative fiction, normally written in prose form, and which is typically published as a book."
    }
};

// Common student questions and answers
const commonQuestions = {
    "what is": "I'll provide a definition and explanation of this topic.",
    "how to": "I'll give you step-by-step instructions on how to do this.",
    "explain": "Let me break down this concept for you in simpler terms.",
    "difference between": "I'll compare these concepts and highlight their key differences.",
    "example of": "Here's a practical example to illustrate this concept.",
    "when was": "I'll provide the historical context and timeline for this.",
    "who is": "I'll give you information about this person and their significance.",
    "why does": "I'll explain the reasoning or mechanism behind this phenomenon.",
    "where can i find": "Here are some resources where you can find more information.",
    "help me with": "I'll guide you through this problem step by step."
};

// Generate AI response based on user input
function generateAIResponse(userInput) {
    const input = userInput.toLowerCase();
    
    // Check if it's a greeting
    if (input.match(/^(hi|hello|hey|greetings)/i)) {
        return "Hello! I'm your AI tutor. How can I help you with your studies today?";
    }
    
    // Check if it's a thank you
    if (input.match(/^(thanks|thank you|thx)/i)) {
        return "You're welcome! Feel free to ask if you have any other questions.";
    }
    
    // Check if it's a goodbye
    if (input.match(/^(bye|goodbye|see you)/i)) {
        return "Goodbye! Feel free to come back anytime you need help with your studies.";
    }
    
    // Check for specific subjects
    for (const subject in aiTutorKnowledge) {
        if (input.includes(subject)) {
            for (const topic in aiTutorKnowledge[subject]) {
                if (input.includes(topic)) {
                    return aiTutorKnowledge[subject][topic];
                }
            }
            // If subject found but no specific topic
            return `I can help you with various topics in ${subject}. Could you specify which aspect you're interested in?`;
        }
    }
    
    // Check for common question patterns
    for (const pattern in commonQuestions) {
        if (input.includes(pattern)) {
            // Extract the topic from the question
            const parts = input.split(pattern);
            const topic = parts[1] ? parts[1].trim() : '';
            
            if (topic) {
                return `${commonQuestions[pattern]} Regarding "${topic}": \n\n` + 
                       generateTopicResponse(topic);
            }
        }
    }
    
    // Default responses for various academic questions
    if (input.includes("exam") || input.includes("test")) {
        return "Preparing for exams requires good organization and consistent study habits. Make sure to review your notes regularly, create a study schedule, practice with past exams if available, and take care of your health by getting enough sleep and eating well.";
    }
    
    if (input.includes("essay") || input.includes("paper") || input.includes("writing")) {
        return "When writing academic papers, start with a clear thesis statement, create an outline, use credible sources, and make sure to revise and proofread your work. The writing process typically includes prewriting, drafting, revising, editing, and proofreading.";
    }
    
    if (input.includes("study") || input.includes("learn")) {
        return "Effective study techniques include active recall, spaced repetition, the Pomodoro technique (25 minutes of focused study followed by a 5-minute break), teaching concepts to others, and connecting new information to things you already know.";
    }
    
    if (input.includes("homework") || input.includes("assignment")) {
        return "To manage your assignments effectively, break them down into smaller tasks, prioritize based on deadlines and difficulty, eliminate distractions while working, and don't hesitate to ask for help if you're stuck.";
    }
    
    if (input.includes("research")) {
        return "When conducting research, start with a clear research question, use academic databases and scholarly sources, take organized notes, evaluate sources for credibility, and properly cite all references according to the required citation style (APA, MLA, Chicago, etc.).";
    }
    
    if (input.includes("presentation") || input.includes("public speaking")) {
        return "For effective presentations, know your audience, structure your content with a clear introduction, body, and conclusion, use visual aids sparingly, practice multiple times, and remember to speak clearly and make eye contact with your audience.";
    }
    
    if (input.includes("group project") || input.includes("teamwork")) {
        return "Successful group projects require clear communication, defined roles and responsibilities, regular check-ins, respect for all team members' ideas, and a plan for resolving conflicts constructively.";
    }
    
    // Generic response if no specific pattern is matched
    return "That's an interesting question! While I don't have specific information on that exact topic, I can help you research it or break it down into more specific questions. Could you provide more details about what you're trying to learn?";
}

// Generate a response about a specific topic
function generateTopicResponse(topic) {
    // Check all knowledge bases for the topic
    for (const subject in aiTutorKnowledge) {
        for (const subtopic in aiTutorKnowledge[subject]) {
            if (topic.includes(subtopic)) {
                return aiTutorKnowledge[subject][subtopic];
            }
        }
    }
    
    // If topic not found in knowledge base, generate a generic but helpful response
    const responses = [
        `${topic} is an important concept to understand. I recommend breaking it down into smaller parts and researching each component separately.`,
        `When studying ${topic}, make sure to look for reputable academic sources and take organized notes on key concepts.`,
        `${topic} can be approached from multiple perspectives. Consider looking at textbooks, academic journals, and online educational resources to get a comprehensive understanding.`,
        `For ${topic}, I suggest starting with the fundamentals and gradually building up to more complex aspects of the subject.`,
        `${topic} is a fascinating area of study. To learn more, I recommend checking your course materials, visiting the library, or using academic databases available through your university.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}