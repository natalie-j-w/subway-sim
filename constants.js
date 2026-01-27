/** CSS variables for use in js.
 * 
 * DON'T REDEFINE VARIABLES HERE WITHOUT ALSO RENAMING THEM IN THEIR RESPECTIVE FILES!
*/
export const CSS_VARS = {
    // Class names for Dot.css
    STATION_CLASSNAME: 'station-dot',
    STATION_LABEL_CLASSNAME: 'station-dot__label',

    // Class names for TrackView (TrackView.css TBD)
    TRACK_CLASSNAME: 'connection-line',
    TRACK_LABEL_CLASSNAME: 'connection-line__label',

    // Global constants from main.css
    STATION_SIZE: '--station-size',
    STATION_COLOR: '--station-color',
    STATION_BORDER_COLOR: '--station-border-color',
    TRACK_COLOR: '--line-color'
}

export const JS_VARS = {
    STATION_NAME_MAXLENGTH: 20,
}