class App {
  constructor() {
    this.urls = {
      base: "https://swapi.dev/api/",
      people: "people/",
      planets: "planets/",
    };
  }

  init() {
    console.log("initiated");
    this.buildContent();
  }

  buildNav() {
    const nav = document.createElement("div");
    nav.className = "navbar bg-base-100";

    nav.innerHTML = `
        
        <div class="navbar-start">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
        
            <li>
              <button id="nav-people" >people</button>
            </li>
            <li>
              <button id="nav-planets" >planets</button>
            </li>
          </ul>
        </div>
        <a class="btn btn-ghost normal-case text-xl">ChucksSwapi</a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal p-0">
        <li>
        <button id="nav-people" >people</button>
      </li>
      <li>
        <button id="nav-planets" >planets</butt>
        </ul>
      </div>
      <div class="navbar-end hidden md:block">
        <form action="/" onsubmit="search()">
          <div class="form-control">
            <input
              name="search"
              type="text"
              placeholder="Search"
              class="input input-bordered"
            />
          </div>
        </form>
      </div>
        `;

    document.body.appendChild(nav);

    document.querySelector("#nav-people").addEventListener("click", () => {
      document.querySelector("section").innerHTML = ``;
      this.buildContent(this.urls.base + this.urls.people);
    });
    document.querySelector("#nav-planets").addEventListener("click", () => {
      document.querySelector("section").innerHTML = ``;
      this.buildContent(this.urls.base + this.urls.planets);
    });
  }

  async getData(endpoint) {
    console.log(endpoint);
    try {
      const req = await fetch(endpoint);
      const res = await req.json();

      return res;
    } catch (error) {
      console.error(error);
    }
  }

  async buildContent(endpoint) {
    document.body.innerHTML = ``;

    this.buildNav();

    const section = document.createElement("section");

    section.id = "main";

    console.log(endpoint);
    const data = await this.getData(
      endpoint || this.urls.base + this.urls.people
    );

    const div = document.createElement("div");
    console.log(data);

    div.className = "mx-5 md:grid grid-flow-row-dense grid-cols-3 grid-rows-3";

    section.appendChild(div);

    div.innerHTML = `
      ${data.results
        .map(
          (info, i) => `
        <div class="card my-5 md:w-52 lg:w-72 bg-primary text-primary-content">
          <div class="card-body">
            <h2 class="card-title">${info.name}</h2>
            <p>
              <span style="font-weight: bold">Gender: </span>${info.gender}
            </p>
            <p>
              <span style="font-weight: bold">Hair Color:</span>
              ${info["hairnullcolor"]}
            </p>
            <p>
              <span style="font-weight: bold">Eye Color:</span>${info["eyenullcolor"]}
            </p>
            <p>
              <span style="font-weight: bold">Height: </span>${info.height}
            </p>
            <p>
              <span style="font-weight: bold">Skin Color: </span>${info.skinnullcolor}
            </p>
          </div>
        </div>
     `
        )
        .join(" ")}
    `;

    document.body.appendChild(section);

    if (data.previous || data.next) {
      const btnGroup = document.createElement("div");
      btnGroup.className = `btn-group content-center justify-center my-10`;

      if (data.previous) {
        const prev = document.createElement("button");
        prev.className = `btn`;

        btnGroup.appendChild(prev);

        prev.addEventListener("click", () => {
          section.innerHTML = "";
          this.buildContent(data.previous);
        });

        let url = new URL(data.previous);
        let params = url.pathname.split("/");
        let param = params[params.length - 2];
        prev.innerText = `<< Previous ${param}`;
      }

      if (data.next) {
        const next = document.createElement("button");
        next.className = `btn`;

        btnGroup.appendChild(next);

        let url = new URL(data.next);
        let params = url.pathname.split("/");
        let param = params[params.length - 2];

        next.innerText = `Next ${param} >>`;

        next.addEventListener("click", () => {
          section.innerHTML = "";
          this.buildContent(data.next);
        });
      }
      section.appendChild(btnGroup);
    }
  }
}

window.onload = () => {
  new App().init();
};
