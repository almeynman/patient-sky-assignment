# How to run

1. Install node modules with
```
npm install
```

2. Run tests with 
```
npm test
```

1. Build with
```
npm run build
```


# About the codebase

- Here I chose not to use classes and write modules in functional style. However the modules can be easily organized in classes using same domain segregations, i.e. user, card, fare, journey...
- Calendar data is stored under `calendar_data` folder
- Core folder contains business logic, i.e. service, repository, etc.
- Lib folder contains files that can be released as a library for dealing with time intervals
