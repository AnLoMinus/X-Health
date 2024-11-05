// State management
let healthData = {};
let currentCourse = null;
let courseProgress = {};

// Initialize learning paths
function initializeLearningPaths() {
  const startLinks = document.querySelectorAll(".start-learning");

  startLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const pathCard = e.target.closest(".path-card");
      const level = pathCard.querySelector("h3").textContent;
      localStorage.setItem("currentLevel", level);
    });
  });
}

function startLearningPath(level) {
  // This function will be expanded as we add course content
  console.log(`Starting ${level} learning path`);
  // Here we'll add logic to load course content and track progress
}

// Keep existing health tracking functionality
function saveHealthMetrics() {
  const weight = document.getElementById("weight").value;
  const bloodPressure = document.getElementById("bloodPressure").value;
  const cholesterol = document.getElementById("cholesterol").value;

  healthData = {
    weight,
    bloodPressure,
    cholesterol,
    timestamp: new Date().toISOString(),
  };

  console.log("Saving health metrics:", healthData);
  generateRecommendations();
}

async function loadProgress() {
  try {
    const response = await fetch("/data/progress.json");
    courseProgress = await response.json();
    updateProgressDisplay();
  } catch (error) {
    console.error("Error loading progress:", error);
  }
}

function updateProgressDisplay() {
  const beginnerCourse = courseProgress.courses.beginner;
  const totalModules = Object.keys(beginnerCourse.modules).length;
  let completedModules = 0;
  let totalScore = 0;
  let totalQuizzes = 0;

  Object.values(beginnerCourse.modules).forEach((module) => {
    if (module.completedLessons === module.totalLessons) {
      completedModules++;
    }
    totalScore += module.quizzes.score;
    totalQuizzes += module.quizzes.completed;
  });

  const progressPercent = (completedModules / totalModules) * 100;
  const averageScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;

  document.getElementById(
    "beginnerProgress"
  ).style.width = `${progressPercent}%`;
  document.getElementById(
    "beginnerProgress"
  ).textContent = `${progressPercent.toFixed(1)}%`;
  document.getElementById(
    "beginnerCompleted"
  ).textContent = `${completedModules}/${totalModules}`;
  document.getElementById(
    "beginnerScore"
  ).textContent = `${averageScore.toFixed(1)}%`;
}

// Add to existing code
function updateBreadcrumb() {
  const path = window.location.pathname;
  const breadcrumbList = document.querySelector(".breadcrumb-list");
  if (!breadcrumbList) return;

  // Clear existing breadcrumb
  breadcrumbList.innerHTML = "";

  // Build breadcrumb based on current path
  const pathSegments = path.split("/").filter((segment) => segment);
  let currentPath = "";

  // Always add home
  breadcrumbList.innerHTML += `
        <li class="breadcrumb-item">
            ${path === "/" ? "Home" : '<a href="/">Home</a>'}
        </li>
    `;

  // Add remaining segments
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    const readableName = segment
      .replace(".html", "")
      .replace(/^[a-z]|[A-Z]/g, (letter) => letter.toUpperCase())
      .replace(/-/g, " ");

    breadcrumbList.innerHTML += `
            <li class="breadcrumb-item ${isLast ? "active" : ""}">
                ${
                  isLast
                    ? readableName
                    : `<a href="${currentPath}">${readableName}</a>`
                }
            </li>
        `;
  });
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeLearningPaths();
  initializeCommunityPosts();
  loadProgress();
  updateBreadcrumb();
});
