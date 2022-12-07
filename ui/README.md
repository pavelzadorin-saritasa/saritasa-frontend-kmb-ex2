# exercise-ui

---

<!-- TODO: This section is to be removed when a project is started. -->

## Boilerplate info (to be removed)

<section>
  <ol class="next-steps">
    <li>
      Globally replace <code>exercise-ui</code> to your project
      name in
      <em>kebab-case</em>
    </li>
    <li>
      Globally replace <code>eu</code> to your project prefix, it should be
      a short lowercased abbreviation of your project name
    </li>
    <li>Set up the environment</li>
    <li>Delete the <code>dashboard</code> feature</li>
    <li>Fill the root README with relevant data and remove this section</li>
    <li>
      Adjust <code>CODEOWNERS</code> of your application, make sure you have at
      least one code reviewer before starting a project 👨‍💻
    </li>
  </ol>

  <p>
    <strong>And that's it, your're ready to go! 🥷😎</strong>
  </p>
</section>

---

## Resources

- [Jira](https://saritasa.atlassian.net/jira/your-work)
- [Invision](https://projects.invisionapp.com/d/main#/projects)

## Requirements

Please see the `engines` section in `package.json`

## Building

Please see the `package.json` to see different build configurations

### Handling `robots.txt`

> By default, `development` environment is hidden from search engines

If you need to have specific behavior from search engines, you can add the following:

`<project>` - name of the project (folder name in `projects/` directory)
`<environment>` - name of the environment (e.g: `development`/`production`/etc)

1. Copy assets from `angular.json/projects/<project>/architect/build/assets` to `angular.json/projects/<project>/architect/build/configurations/<environment>/assets`
2. Add `"projects/<project>/src/robots.txt"` to the newly-created array of assets
3. Create `projects/<project>/src/robots.txt`

## Environment

We stick to the default Angular-provided way to pass variables within the application, but, to keep the single source of truth and be able to pass bash/environment-provided variables, we also use [@ngx-env/builder](https://github.com/chihab/ngx-env). See examples on how to use it in [our code](projects/web/src/environments/environment.ts).

## Development (most of the practices described in [wiki](https://frontendwiki.saritasa.rocks/))

### Project structure

We stick the our [guidelines described in wiki](https://frontendwiki.saritasa.rocks/pages/development/angular/project-structure.html)

### Architecture

Again, [wiki](https://frontendwiki.saritasa.rocks/pages/development/angular/architecture.html)

### Theming

By default, we use the following convention for properties:

```css
--primary-color: #233faa;
--primary-dark-color: #283593;
--primary-light-color: #c5cae9;
--primary-contrast-color: white;
--primary-dark-contrast-color: white;
--primary-light-contrast-color: black;

/* Then you can use 'secondary', 'tertiary', 'error', 'warning', 'success' and so on */
```

Then you can use these variables in the project or to configure ui frameworks.

To generate this palette you can take every color(contrast, dark, light...) from designs or choose main and use generators for the purpose.
Two most usable generators:

- [Ionic color generator](https://ionicframework.com/docs/theming/colors#new-color-creator). Don't look that it's made by "ionic". This generator is really convenient and we relied on it when we made the existing scheme.
- [Material design generator](http://mcg.mbitson.com/#!?mcgpalette0=%233f51b5). Use it when you define a custom theme for angular material or you just want to have a more detailed palette.

> If you use angular-material on your project, you need to define mat-theme as well. Open `material-custom-theme.scss` file to see an example how it should be done. Please, use css custom properties that you've already defined for the app, it makes it easier to refactor or add new functionality (like dark mode or dynamic theme).

### Generating new environment

Please see [Angular guideline](https://angular.io/guide/build#using-environment-specific-variables-in-your-app) and [@ngx-env/builder](https://github.com/chihab/ngx-env#in-env) in case it's bash/environment-provided

### Generating new app

1. Create new application `npx ng g app <app_name> -p eu<first_letter_of_your_app_name>`
2. Add [env declaration](env.d.ts) into the [files] section of newly-created tsconfigs (`tsconfig.{app|spec}.json`). See example in the [original tsconfig files](projects/web/tsconfig.app.json)
3. Set up basic structure for this app `features`, `shared` etc. (see wiki)
4. Adjust testing configuration

   - Add the following code to newly generated `test.ts`

     ```ts
     defineGlobalsInjections({
       providers: [{ provide: AppConfig, useClass: TestAppConfig }],
     });
     ```

   - Add `failSpecWithNoExpectations: true` to `karma.conf.js`

   - Add the following code to newly generated `karma.conf.js` ([reference](https://angular.io/guide/testing#configure-cli-for-ci-testing-in-chrome))

     ```js
         browsers: ['Chrome'],
         customLaunchers: {
           ChromeHeadlessCI: {
             base: 'ChromeHeadless',
             flags: ['--no-sandbox']
           }
         },
     ```

   > Please be aware, that `defineGlobalsInjections()` must be called before the modules are loaded. In the default Angular `test.ts` this means before `context.keys().map(context);` ([reference](https://ngneat.github.io/spectator/docs/global-injections/))

5. (optional) Set up component libraries

   - Add Angular Material for this app ([guide](https://material.angular.io/guide/getting-started))
   - Ionic `npx ng add @ionic/angular --project <app_name>` (and `npx ionic init --multi-app` if `ionic.config.json` is not present)

6. (optional) Provide interceptors (see examples in default project's `app.module.ts`)
7. (optional) Set up environment
   1. Provide `AppConfigService` implementation, see [example](projects/web/src/app/features/shared/web-app-config.service.ts)
   2. Set up the `@ngx-env/builder` for this application by using `ng add @ngx-env/builder --project <app_name>`.
      > The order matters here, it's gotta be done only after Material is set up, otherwise Angular will scream at you since the builder is not the default one
