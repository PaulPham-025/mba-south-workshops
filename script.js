(function () {
  const config = window.WORKSHOP_SITE_CONFIG || {};
  const workshops = Array.isArray(config.workshops) ? config.workshops : [];
  const upcomingCount = Number(config.upcomingCount) || 2;
  const list = document.getElementById("workshopList");
  const introVideo = document.getElementById("introVideo");
  const wednesdayVideoRegistration = document.getElementById("wednesdayVideoRegistration");

  if (config.introVideoUrl && introVideo) {
    introVideo.src = config.introVideoUrl;
  }

  function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDate(value) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  }

  function nextDateForWeekday(weekday, offsetWeeks) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysUntil = (weekday - today.getDay() + 7) % 7;
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    date.setDate(date.getDate() + daysUntil + offsetWeeks * 7);
    return date;
  }

  function getUpcomingSessions(workshop) {
    const weekday = Number(workshop.weekday);
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
      return [];
    }

    return Array.from({ length: upcomingCount }, (_, index) => {
      const date = nextDateForWeekday(weekday, index);
      const dateKey = toDateKey(date);
      return {
        ...workshop,
        date: dateKey,
        sessionId: `${workshop.id}-${dateKey}`
      };
    });
  }

  const workshopGroups = workshops.map((workshop) => ({
    ...workshop,
    sessions: getUpcomingSessions(workshop)
  }));

  const sessions = workshopGroups
    .flatMap((workshop) => workshop.sessions)
    .sort((a, b) => {
      const dateOrder = a.date.localeCompare(b.date);
      return dateOrder || a.time.localeCompare(b.time);
    });

  function renderWorkshopBody(workshop) {
    if (workshop.bodyHtml) {
      return `<div class="workshop-body">${workshop.bodyHtml}</div>`;
    }

    return `<p>${workshop.description}</p>`;
  }

  function getFormsUrl(session) {
    return (session && session.msFormsUrl) || config.msFormsUrl || "";
  }

  function openRegistration(session) {
    const formsUrl = getFormsUrl(session);
    if (!formsUrl) {
      alert("Chưa có đường dẫn Microsoft Forms cho workshop này.");
      return;
    }

    window.open(formsUrl, "_blank", "noopener,noreferrer");
  }

  function renderWorkshops() {
    list.innerHTML = workshopGroups.map((workshop) => `
      <article class="workshop-card">
        <div>
          <div class="workshop-meta">
            <span class="pill">${workshop.format}</span>
            <span class="pill">${workshop.time}</span>
          </div>
          <h3>${workshop.title}</h3>
          ${renderWorkshopBody(workshop)}
        </div>
        <div class="date-choice-list" aria-label="Hai ngày đăng ký gần nhất cho ${workshop.title}">
          ${workshop.sessions.map((session) => `
            <button class="date-choice" type="button" data-session-id="${session.sessionId}">
              <span>${formatDate(session.date)}</span>
              <strong>Đăng ký</strong>
            </button>
          `).join("")}
        </div>
      </article>
    `).join("");

    list.querySelectorAll("[data-session-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const session = sessions.find((item) => item.sessionId === button.dataset.sessionId);
        openRegistration(session);
      });
    });
  }

  function renderWednesdayVideoRegistration() {
    if (!wednesdayVideoRegistration) {
      return;
    }

    const nextWednesdaySession = sessions.find((session) => session.id === "quan-ly-tai-chinh-dai-ly");
    if (!nextWednesdaySession) {
      wednesdayVideoRegistration.innerHTML = "";
      return;
    }

    wednesdayVideoRegistration.innerHTML = `
      <span>Đăng ký tham dự lớp gần nhất</span>
      <strong>${formatDate(nextWednesdaySession.date)} | ${nextWednesdaySession.time}</strong>
      <button class="button primary" type="button">Đăng ký ngày này</button>
    `;

    wednesdayVideoRegistration
      .querySelector("button")
      .addEventListener("click", () => openRegistration(nextWednesdaySession));
  }

  renderWorkshops();
  renderWednesdayVideoRegistration();
}());
