# MBA South Workshop Series Website

Open `index.html` in a browser to preview the site.

## Customize

- For publishing, place the workshop schedule image at `assets/lich-ws-dinh-ky.png.png`.
- Update workshop details in `config.js`.
- The site automatically shows the next `upcomingCount` dates for each recurring workshop. Use `weekday: 3` for Wednesday and `weekday: 5` for Friday.
- Each workshop appears as one clean card with the nearest upcoming registration date inside the card.
- Replace `introVideoUrl` with a YouTube embed URL for your intro video.
- Update the footer email in `index.html`.

## Connect Microsoft Forms

1. Create a Microsoft Form for workshop registration.
2. Add a question such as `Bạn muốn đăng ký workshop nào?` so registrants can pick the session.
3. Click `Collect responses` and copy the form link.
4. Paste the link into `msFormsUrl` in `config.js`.

If you prefer separate Forms for each workshop, add `msFormsUrl` inside each workshop object in `config.js`; that per-workshop link will override the shared link.
