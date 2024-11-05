class AnatomyLesson {
  constructor() {
    this.progress = 0;
    this.currentLessonPath = window.location.pathname;
    this.quizData = {
      questions: [
        {
          question: "What is the basic unit of life?",
          options: ["Atom", "Cell", "Tissue", "Organ"],
          correct: 1,
        },
        {
          question: "In anatomical position, the palms are facing:",
          options: ["Backward", "Forward", "Inward", "Downward"],
          correct: 1,
        },
        {
          question: "Which term means 'toward the head'?",
          options: ["Inferior", "Superior", "Anterior", "Posterior"],
          correct: 1,
        },
      ],
    };
    this.init();
  }

  async init() {
    this.loadInteractiveDiagrams();
    this.setupQuiz();
    this.setupEventListeners();
    await this.loadProgress();
  }

  loadInteractiveDiagrams() {
    // Organization Levels Diagram
    const orgLevels = document.getElementById("organizationLevels");
    if (orgLevels) {
      // Add interactive elements
      const levels = [
        "Chemical",
        "Cellular",
        "Tissue",
        "Organ",
        "System",
        "Organism",
      ];
      levels.forEach((level, index) => {
        const hotspot = document.createElement("div");
        hotspot.className = "diagram-hotspot";
        hotspot.style.left = `${(index + 1) * 15}%`;
        hotspot.style.top = "50%";
        hotspot.setAttribute("data-level", level);
        orgLevels.appendChild(hotspot);
      });
    }

    // Anatomical Position Diagram
    const anatomicalPos = document.getElementById("anatomicalPosition");
    if (anatomicalPos) {
      // Add interactive markers
      const positions = [
        { name: "Superior", top: "10%", left: "50%" },
        { name: "Inferior", top: "90%", left: "50%" },
        { name: "Anterior", top: "50%", left: "70%" },
        { name: "Posterior", top: "50%", left: "30%" },
      ];

      positions.forEach((pos) => {
        const marker = document.createElement("div");
        marker.className = "diagram-hotspot";
        marker.style.top = pos.top;
        marker.style.left = pos.left;
        marker.setAttribute("data-position", pos.name);
        anatomicalPos.appendChild(marker);
      });
    }
  }

  setupQuiz() {
    const quizContainer = document.getElementById("lessonQuiz");
    if (!quizContainer) return;

    this.quizData.questions.forEach((q, index) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "quiz-question";
      questionDiv.innerHTML = `
                <p><strong>Question ${index + 1}:</strong> ${q.question}</p>
                <div class="quiz-options">
                    ${q.options
                      .map(
                        (opt, i) => `
                        <label>
                            <input type="radio" name="q${index}" value="${i}">
                            ${opt}
                        </label>
                    `
                      )
                      .join("")}
                </div>
            `;
      quizContainer.appendChild(questionDiv);
    });

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Check Answers";
    submitBtn.className = "quiz-submit";
    submitBtn.onclick = () => this.checkQuiz();
    quizContainer.appendChild(submitBtn);
  }

  setupEventListeners() {
    // Update navigation buttons
    const markCompleteBtn = document.getElementById("markComplete");
    const nextLessonBtn = document.getElementById("nextLessonBtn");

    if (markCompleteBtn) {
      markCompleteBtn.addEventListener("click", () => this.completeLesson());
    }

    if (nextLessonBtn) {
      nextLessonBtn.addEventListener("click", () => this.goToNextLesson());
    }

    // Add home navigation
    document
      .querySelector('a[href="../../"]')
      .addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../../index.html";
      });

    // Diagram Hotspots
    document.querySelectorAll(".diagram-hotspot").forEach((hotspot) => {
      hotspot.addEventListener("mouseenter", (e) => this.showHotspotInfo(e));
      hotspot.addEventListener("mouseleave", (e) => this.hideHotspotInfo(e));
    });
  }

  async loadProgress() {
    try {
      const response = await fetch("/data/progress.json");
      const data = await response.json();
      this.progress = data.courses.beginner.modules.anatomy.completedLessons;
      this.updateProgressUI();
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  }

  checkQuiz() {
    let score = 0;
    this.quizData.questions.forEach((q, index) => {
      const selected = document.querySelector(
        `input[name="q${index}"]:checked`
      );
      if (selected && parseInt(selected.value) === q.correct) {
        score++;
      }
    });

    const percentage = (score / this.quizData.questions.length) * 100;
    alert(`Your score: ${percentage}%`);

    if (percentage >= 70) {
      document.getElementById("markComplete").removeAttribute("disabled");
    }
  }

  async completeLesson() {
    try {
      // Update progress
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          module: "anatomy",
          lesson: 1,
          completed: true,
        }),
      });

      if (response.ok) {
        this.goToNextLesson();
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }

  goToNextLesson() {
    // Get current lesson number from URL
    const currentLessonNum = parseInt(
      this.currentLessonPath.match(/lesson(\d+)/)[1]
    );
    const nextLessonNum = currentLessonNum + 1;

    // Navigate to next lesson
    window.location.href = `lesson${nextLessonNum}.html`;
  }

  showHotspotInfo(event) {
    const hotspot = event.target;
    const info = document.createElement("div");
    info.className = "hotspot-info";
    info.textContent = hotspot.dataset.level || hotspot.dataset.position;
    hotspot.appendChild(info);
    info.style.display = "block";
  }

  hideHotspotInfo(event) {
    const hotspot = event.target;
    const info = hotspot.querySelector(".hotspot-info");
    if (info) {
      info.remove();
    }
  }
}

// Initialize the lesson when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.anatomyLesson = new AnatomyLesson();
});
