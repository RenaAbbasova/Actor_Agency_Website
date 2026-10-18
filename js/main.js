/* Vanessa · sitio de demostración. JavaScript sin dependencias. */
(function () {
  "use strict";

  /* ---------- Tema claro / oscuro ---------- */
  var root = document.documentElement;
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      var dark = theme === "dark";
      btn.setAttribute("aria-pressed", String(dark));
      btn.setAttribute("aria-label", dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    }
  }
  setTheme(root.getAttribute("data-theme") || "light");
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      setTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* almacenamiento no disponible */ }
    });
  }

  /* ---------- Utilidades para construir el DOM sin innerHTML ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k]; else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }
  function avatarSrc(index) { return "images/avatar-" + String(index + 1).padStart(2, "0") + ".svg"; }
  function profileHref(actor) { return "profile.html?id=" + encodeURIComponent(actor.id); }
  function avatarImg(actor, index) {
    return el("img", { src: avatarSrc(index), width: "400", height: "500", loading: "lazy",
                       alt: "Ilustración de ejemplo para el perfil de " + actor.name });
  }

  if (typeof ACTORS !== "undefined") {
    /* ---------- actores.html: galería ---------- */
    var gallery = document.getElementById("actor-grid");
    if (gallery) {
      ACTORS.forEach(function (a, i) {
        var link = el("a", { href: profileHref(a), class: "actor-tile" }, [
          avatarImg(a, i),
          el("span", { class: "actor-tile__name", text: a.name }),
          el("span", { class: "actor-tile__role", text: a.role })
        ]);
        gallery.appendChild(el("li", {}, [link]));
      });
    }

    /* ---------- casting.html: tarjetas ---------- */
    var cards = document.getElementById("casting-grid");
    if (cards) {
      ACTORS.slice(0, 10).forEach(function (a, i) {
        var title = el("h2", { class: "card__name", text: a.name });
        var card = el("article", { class: "card" }, [
          avatarImg(a, i), title,
          el("p", { class: "card__role", text: a.role }),
          el("p", { class: "card__bio", text: a.bio }),
          el("a", { href: profileHref(a), class: "button", "aria-label": "Ver perfil de " + a.name, text: "Ver perfil" })
        ]);
        cards.appendChild(el("li", {}, [card]));
      });
    }

    /* ---------- profile.html: detalle ---------- */
    var holder = document.getElementById("profile");
    if (holder) {
      var id = new URLSearchParams(window.location.search).get("id");
      var index = ACTORS.findIndex(function (a) { return a.id === id; });
      if (index === -1) {
        holder.appendChild(el("h1", { text: "Perfil no encontrado" }));
        holder.appendChild(el("p", { class: "notice", text: "No encontramos ese perfil." }));
        holder.appendChild(el("a", { href: "actores.html", class: "button", text: "Ver todos los actores" }));
      } else {
        var a = ACTORS[index];
        document.title = a.name + " · Vanessa";
        var details = el("dl", { class: "facts" }, [
          el("dt", { text: "Edad" }), el("dd", { text: a.age + " años" }),
          el("dt", { text: "Altura" }), el("dd", { text: a.height + " cm" }),
          el("dt", { text: "Idiomas" }), el("dd", { text: a.languages.join(", ") })
        ]);
        var chips = el("ul", { class: "chips", "aria-label": "Habilidades" }, a.skills.map(function (s) { return el("li", { text: s }); }));
        holder.appendChild(el("div", { class: "profile__photo" }, [avatarImg(a, index)]));
        holder.appendChild(el("div", { class: "profile__text" }, [
          el("h1", { text: a.name }), el("p", { class: "profile__role", text: a.role }),
          el("p", { text: a.bio }), details, el("h2", { text: "Habilidades" }), chips,
          el("p", { class: "notice", text: "Perfil ficticio de ejemplo." }),
          el("a", { href: "contact.html", class: "button", text: "Contactar con la agencia" })
        ]));
      }
    }
  }

  /* ---------- Formularios de demostración (no hay servidor) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("form[data-demo]"), function (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (status) { status.textContent = form.getAttribute("data-demo"); status.hidden = false; }
      form.reset();
    });
  });
})();
