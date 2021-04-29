class RegistryResource {
  /* ACCESS ONLY through getters and setters.
   * These fields should be made private once
   * https://github.com/tc39/proposal-private-methods#private-methods-and-fields
   * is in ECMA officially.
   */
  viewAll;
  viewAllTemplate;
  viewTemplate;
  lookupComponent;
  renderFunctionMap = new Map();

  addViewAll = (getAllPath) => {
    this.viewAll = getAllPath;
  }

  addViewAllTemplate = (template) => {
    this.viewAllTemplate = template;
  }

  addViewTemplate = (template) => {
    this.viewTemplate = template;
  }

  getViewAll = () => {
    return this.viewAll;
  }

  getViewAllTemplate = () => {
    return this.viewAllTemplate;
  }

  performViewAllTemplate = (templateParams) => {
    return this.viewAllTemplate(templateParams);
  }

  getViewTemplate = () => {
    return this.viewTemplate;
  }

  // This should take in the object itself, and return the url path of that object in a FOLIO app
  performViewTemplate = (object) => {
    return this.viewTemplate(object);
  }

  addLookupComponent = (component) => {
    this.lookupComponent = component;
  }

  getLookupComponent = () => {
    return this.lookupComponent;
  }

  setRenderFunction = (name, func) => {
    this.renderFunctionMap.set(name, func);
  }

  getRenderFunction = (name) => {
    return this.renderFunctionMap.get(name);
  }
}

export default RegistryResource;
