const form = document.getElementById("regForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const resultDiv = document.getElementById("result");
  const linkDiv = document.getElementById("whatsapp-link");

  resultDiv.innerHTML = "Checking age eligibility...";
  linkDiv.innerHTML = ""; // Clear previous message

  const formData = new FormData(form);
  const imageFile = formData.get("idImage");

  // 🧮 AGE CALCULATOR
  const dobString = formData.get("dob");
const dob = new Date(dobString + "T00:00:00");  // Add time to prevent timezone errors

if (isNaN(dob.getTime())) {
  resultDiv.innerHTML = `<p style="color:red;">Invalid date format. Please select your date of birth.</p>`;
  return;
}

const today = new Date();
let age = today.getFullYear() - dob.getFullYear();
const monthDiff = today.getMonth() - dob.getMonth();
if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
  age--;
}


  const isOfAge = age >= 28;

  // ❌ Block underage users BEFORE submission
  if (!isOfAge) {
    resultDiv.innerHTML = `<p style="color:red;">Sorry, you must be at least 28 years old to join PinkHub. You are ${age}.</p>`;
    return;
  }

  resultDiv.innerHTML = "Submitting your details...";

  const reader = new FileReader();
  reader.onloadend = async function () {
    const base64Image = reader.result.split(",")[1];

    const payload = new URLSearchParams();
    payload.append("firstname", formData.get("firstname"));
    payload.append("middlename", formData.get("middlename"));
    payload.append("lastname", formData.get("lastname"));
    payload.append("email", formData.get("email"));
    payload.append("phone", formData.get("phone"));
    payload.append("dob", formData.get("dob"));
    payload.append("idnumber", formData.get("idnumber"));
    payload.append("filename", imageFile.name);
    payload.append("image", base64Image);
    payload.append("age", age);
    payload.append("isOfAge", isOfAge);

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwUsnH8Pp2toZJUxIct-HgVZ60YyYRUV8WVrud5u7gDpP533d0eLyQEfUgeKRgeMWoJ/exec", {
        method: "POST",
        body: payload
      });

      const result = await response.json();

      if (result.status === "success") {
          // 🛑 Check for duplicate submission in localStorage
  const previousSubmissions = JSON.parse(localStorage.getItem("pinkhub_submissions")) || [];

  const alreadySubmitted = previousSubmissions.some(entry =>
    entry.phone === formData.get("phone") || entry.idnumber === formData.get("idnumber")
  );

  if (alreadySubmitted) {
    resultDiv.innerHTML = `<p style="color:red;">This phone number or ID has already been submitted.</p>`;
    return;
  }

  // ✅ Save new submission to localStorage
  previousSubmissions.push({
    phone: formData.get("phone"),
    idnumber: formData.get("idnumber")
  });
  localStorage.setItem("pinkhub_submissions", JSON.stringify(previousSubmissions));

        resultDiv.innerHTML = `<p>Form submitted successfully. You are ${age} years old. Please check your email for your Membership No.
        </p>`;
        form.reset();

        const joinBtn = document.createElement("button");
        joinBtn.textContent = "Join WhatsApp Group";
        joinBtn.style.padding = "10px 20px";
        joinBtn.style.backgroundColor = "#25D366";
        joinBtn.style.color = "white";
        joinBtn.style.border = "none";
        joinBtn.style.borderRadius = "5px";
        joinBtn.style.cursor = "pointer";

        joinBtn.onclick = () => {
          if (confirm("You're verified. Join the WhatsApp group now?")) {
            window.location.href = "https://chat.whatsapp.com/KgFYhdjz2NT2VnwXK95a0F?mode=ac_t";
          }
        };

        linkDiv.appendChild(joinBtn);
      } else {
        resultDiv.innerHTML = `<p>Error: ${result.message}</p>`;
      }

    } catch (err) {
      resultDiv.innerHTML = `<p>Submission failed: ${err.message}</p>`;
    }
  };

  reader.readAsDataURL(imageFile);
});
