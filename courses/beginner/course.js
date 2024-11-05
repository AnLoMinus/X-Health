class BeginnerCourse {
  constructor() {
    this.progress = null;
    this.currentModule = null;
    this.modules = {};
    this.init();
  }

  async init() {
    await this.loadProgress();
    this.setupEventListeners();
    this.updateUI();
  }

  async loadProgress() {
    try {
      const response = await fetch("/data/progress.json");
      const data = await response.json();
      this.progress = data.courses.beginner;
      this.modules = this.progress.modules;
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  }

  setupEventListeners() {
    // Quiz buttons
    document.querySelectorAll(".quiz-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const moduleId = e.target.dataset.quiz;
        this.startQuiz(moduleId);
      });
    });

    // Lesson links
    document.querySelectorAll(".lessons-list a").forEach((link) => {
      link.addEventListener("click", (e) => {
        // Store current lesson info before navigation
        localStorage.setItem("currentLesson", link.getAttribute("href"));
      });
    });
  }

  updateUI() {
    // Update overall progress
    const totalLessons = Object.values(this.modules).reduce(
      (sum, module) => sum + module.totalLessons,
      0
    );
    const completedLessons = Object.values(this.modules).reduce(
      (sum, module) => sum + module.completedLessons,
      0
    );
    const progressPercent = (completedLessons / totalLessons) * 100;

    document.getElementById(
      "courseProgress"
    ).style.width = `${progressPercent}%`;
    document.getElementById(
      "progressPercent"
    ).textContent = `${progressPercent.toFixed(1)}%`;

    // Update module progress badges
    Object.entries(this.modules).forEach(([moduleId, module]) => {
      const badge = document.querySelector(
        `[data-module="${moduleId}"] .progress-badge`
      );
      if (badge) {
        badge.textContent = `${module.completedLessons}/${module.totalLessons} Lessons`;
      }
    });

    this.updateAchievements();
  }

  async loadLesson(lessonUrl) {
    // Here we'll load the lesson content
    console.log("Loading lesson:", lessonUrl);
    // Implementation will depend on how lessons are structured
  }

  startQuiz(moduleId) {
    const module = this.modules[moduleId];
    if (!module) return;

    // Here we'll implement the quiz logic
    console.log("Starting quiz for module:", moduleId);
  }

  updateAchievements() {
    const achievementsGrid = document.querySelector(".achievements-grid");
    achievementsGrid.innerHTML = ""; // Clear existing achievements

    // Add achievements based on progress
    Object.entries(this.modules).forEach(([moduleId, module]) => {
      if (module.completedLessons === module.totalLessons) {
        const achievement = document.createElement("div");
        achievement.className = "achievement-card";
        achievement.innerHTML = `
                    <div class="achievement-icon">🏆</div>
                    <h4>${module.name} Master</h4>
                    <p>Completed all lessons</p>
                `;
        achievementsGrid.appendChild(achievement);
      }
    });
  }

  async saveProgress() {
    try {
      // In a real application, this would be an API call
      console.log("Saving progress:", this.progress);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }
}

// Initialize the course when the page loads
document.addEventListener("DOMContentLoaded", () => {
  window.beginnerCourse = new BeginnerCourse();
});
