import { logs } from "./persistence";

// log('Hellp','WARN');
logs.getlogs({
  start: new Date(new Date() - 24 * 60 * 60 * 1000),
  end: new Date(),
});
