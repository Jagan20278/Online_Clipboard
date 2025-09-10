# 📋 Online Clipboard

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

A secure and modern online clipboard application built with the MERN stack (MongoDB, Express, React, Node.js) that allows you to copy, store, and share text snippets across all your devices seamlessly.



## ✨ Features

* **🔄 Cross-Device Syncing:** Instantly access your clipboard from any logged-in device.
* **🔒 Encrypted Storage:** User passwords are securely hashed using `bcryptjs`.
* **🌐 RESTful API:** A well-structured backend API built with Express.js.
* **🎨 Modern & Responsive UI:** Sleek interface crafted with TailwindCSS and Lucide Icons.
* **⚡ Blazing Fast:** Built with Vite for an incredibly fast development experience.

## 🛠️ Tech Stack

| Category      | Technology                                                                                                   |
|---------------|--------------------------------------------------------------------------------------------------------------|
| **Frontend** | [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)                                             |                                               |     |
| **Tooling** | [ESLint](https://eslint.org/), [PostCSS](https://postcss.org/)                                                  |

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:
* Node.js (v18.x or higher)
* npm 
* Git

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Jagan20278/Online_Clipboard.git
    cd OC/project
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `project/` root directory and add the following variables.
    ```env
    # Server configuration
    PORT=5000


## 📜 Available Scripts

In the project directory, you can run:

* `npm run dev`: Runs the app in development mode with hot-reloading.
* `npm run build`: Bundles the app for production.
* `npm run preview`: Serves the production build locally for previewing.
* `npm run lint`: Lints the source code using ESLint.

## 🗺️ Roadmap

-   [ ] Add support for file and image sharing.
-   [ ] Implement real-time synchronization using WebSockets.
-   [ ] Introduce a dark mode theme.
-   [ ] Add end-to-end testing with Cypress or Playwright.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is distributed under the MIT License. See `LICENSE` for more information.
