export default {
  /**
   * @module svgTags Provides methods to generate SVG based tags for content and object.
   */

  /**
   * @method stringToNum Convert a string into a repeatable numeric value in a range from 0 to modSize.
   * @param {string} inputString - The input string to be converted.
   * @param {number} modSize - The modulo value (must be greater than 0). Set to 1 + max desired return value.
   * @returns {number} The numeric representation of the input string.
   */
  stringToNum(inputString = '@#$%^&*', modSize = 46) {
    if (modSize <= 0) { throw new Error('modSize must be greater than 0'); }
    return [...inputString].reduce((acc, char) => (acc + char.charCodeAt(0)) % modSize, 0);
  },


  /**
   * @const {array} colors Array of colors for use with various SVG generators.
   */
  colors: [
    "#DA0862",
    "#E3005D",
    "#E90047",
    "#EC0A28",
    "#EB1700",
    "#EA2500",
    "#E63100",
    "#DF3D00",
    "#D35100",
    "#CB5E00",
    "#BF6D00",
    "#B07000",
    "#A17A00",
    "#8F8000",
    "#777700",
    "#659400",
    "#4E9B00",
    "#1E9F00",
    "#00A000",
    "#00A21A",
    "#00A43B",
    "#00A653",
    "#00A869",
    "#00A87F",
    "#00A693",
    "#00A2A7",
    "#00A0B3",
    "#009FBD",
    "#009AC9",
    "#0094D4",
    "#008CF0",
    "#0084FF",
    "#007CFF",
    "#0072FF",
    "#2D6BFF",
    "#4E63FF",
    "#625BFF",
    "#724FFF",
    "#7F49F8",
    "#8E43E3",
    "#9D3DD8",
    "#AA36CA",
    "#B52FB8",
    "#C126A7",
    "#CA1D94",
    "#D31580"
  ],

  /**
   * @method listToTags Create colored tags based on the input string of comma separated values.
   * @param {string} inputString - The input string to create colored tags from.
   * @returns {string} HTML representation of colored elements.
   */
  listToTags(inputString = 'Testing, one, two, three') {
    const values = inputString.split(',').map((value) => value.trim());

    const coloredElements = values.map((value) => {
      const colorIndex = this.stringToNum(value);
      const textColor = this.colors[colorIndex];
      const backgroundColor = `${textColor}22`;

      return `
        <button style="
          color: ${textColor};
          background-color: ${backgroundColor};
          padding: 1px 12px;
          border-radius: 50vh;
          border: none;
          font: ${appsmith.theme.fontFamily.appFont};
          font-size: 13px;
          font-weight: 450;
          display: inline-block;
          align-items: center !important;
        ">
          ${value}
        </button>`;
    });

    const coloredElementsHTML = coloredElements.join('');

    return `
      <div class="colored-elements-container" style="white-space: normal !important">
        ${coloredElementsHTML}
      </div>
    `;
  },

  /**
   * @method nameToInitialsSVG Create an SVG representation of colored initials from the input string and return it as a Data URI.
   * @param {string} str - The input string to generate initials from.
   * @returns {string} Data URI of the generated SVG.
   */
  nameToInitialsSVG(str = 'Test User ') {
    const color = this.colors[this.stringToNum(str)];
    const backgroundColor = `${color}33`;
    const initials = str.split(' ').map(word => word.charAt(0).toUpperCase()).join('');

    const svg = `
      <svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r="40%" fill="${backgroundColor}" stroke="${color}" stroke-width="1px" />
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-size="${(6 - initials.length) * 8}%" font-weight="bold" fill="${color}" style="font-family: sans-serif;">
          ${initials}
        </text>
      </svg>
    `;

    const dataURI = `data:image/svg+xml;base64,${btoa(svg)}`;

    return dataURI;
  },

  /**
   * @method selectOptions Generates array of {label, value} objects sorted by label & with unique values, for use in Select or List widgets. 
   * Supports nested paths, and filters out options where the label or value are null or undefined.
   * @param {array} data - An array of objects, from your API or Query response.
   * @param {string} label - A property name, or valid json path. 
   * @param {array} value - A property name, or valid json path.
   * @returns {array} - [{label, value},...] or empty array if path is invalid.
   */
  selectOptions(data = getUsers.data.results, label = 'name.first', value = 'login.username') {
    return _.orderBy(
      _.uniqBy(
        data.map(obj => ({
          label: _.get(obj, label),
          value: _.get(obj, value)
        })).filter(obj => !!obj.label && !!obj.value),
        o => o.label
      ),
      'label'
    );
  },

  /**
   * @method objToRows Converts a single object to an array of {property, value} objects, 
   * for viewing a single row vertically in Select or List widgets. 
   * @param {object} obj - A single row of data from an API, Query, or selected table/list row.
   * @returns {array} - [{property, value},...] or empty array if obj us invalid.
   */
  objToRows(obj = '123') {
    if (!obj || typeof obj != 'object') { return [] }
    return Object.entries(obj).map(([prop, value]) => ({ prop, value }))
  }

}