declare var process: {
  env: {
    readonly NG_APP_VERSION: string;
    readonly NG_APP_COMMIT: string;
    readonly NG_APP_API_URL: string;

    // Replace the line below with your environment variable for better type checking
    readonly [key: string]: string;
  };
};
