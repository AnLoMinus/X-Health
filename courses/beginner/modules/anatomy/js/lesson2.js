class SkeletalSystemLesson extends AnatomyLesson {
  constructor() {
    super();
    this.quizData = {
      questions: [
        {
          question: "Which type of bone tissue forms the hard outer layer?",
          options: ["Spongy bone", "Compact bone", "Bone marrow", "Cartilage"],
          correct: 1,
        },
        {
          question: "What is the primary function of bone marrow?",
          options: [
            "Joint lubrication",
            "Calcium storage",
            "Blood cell production",
            "Bone strength",
          ],
          correct: 2,
        },
        // More questions...
      ],
    };
  }

  loadInteractiveDiagrams() {
    const boneStructure = document.getElementById("boneStructure");
    if (boneStructure) {
      // Add interactive elements for bone structure
      const parts = [
        { name: "Compact Bone", top: "30%", left: "50%" },
        { name: "Spongy Bone", top: "50%", left: "50%" },
        { name: "Bone Marrow", top: "70%", left: "50%" },
      ];

      parts.forEach((part) => {
        const marker = document.createElement("div");
        marker.className = "diagram-hotspot";
        marker.style.top = part.top;
        marker.style.left = part.left;
        marker.setAttribute("data-part", part.name);
        boneStructure.appendChild(marker);
      });
    }
  }
}

// Initialize the lesson
document.addEventListener("DOMContentLoaded", () => {
  window.currentLesson = new SkeletalSystemLesson();
});
