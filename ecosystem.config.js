module.exports = {
  apps: [
    {
      name: "proyectoApi",
      script: "node",
      args: "ace serve --watch",
      interpreter: "none",
      env: {
         NODE_ENV: "production",
 	 PATH: process.env.PATH,
 	 // Añadir el siguiente linea
 	 DOTENV_CONFIG_PATH: "/home/ubuntu/proyectos/proyectoApi/.env",
      },
    },
  ],
};
