// Toggle project details on click
function showDetails(projectId) {
  const projectDetails = document.getElementById(projectId);
  if (projectDetails.style.display === "block") {
    projectDetails.style.display = "none";
  } else {
    projectDetails.style.display = "block";
  }
}

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  alert(`Thank you, ${name}! Your message has been sent.`);
  // Clear form
  document.getElementById('contactForm').reset();
});
