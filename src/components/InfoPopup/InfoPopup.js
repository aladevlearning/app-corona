
import uniq from 'lodash/uniq';

const InfoPopup = (props) => {

  const { properties } = props.selectedFeature;
  const { centres } = props;
  const key = `${properties.longitude}-${properties.latitude}`;

  const infoMap = buildInfoMap(centres);


  if (infoMap.has(key) && infoMap.get(key).length > 1) {

    const [firstCentre, secondCentre] = infoMap.get(key);
    const firstOpeningMap = new Map();
    firstCentre.openingHours.forEach(time => {
      firstOpeningMap.set(time.day, `${time.timeStart?.substring(0, 5)}-${time.timeEnd?.substring(0, 5)}`)
    })

    const secondOpeningMap = new Map();
    secondCentre.openingHours.forEach(time => {
      secondOpeningMap.set(time.day, `${time.timeStart?.substring(0, 5)}-${time.timeEnd?.substring(0, 5)}`)
    })

    const uniqueDays = uniq([...firstOpeningMap.keys()].concat([...secondOpeningMap.keys()]))
    let timeTables = `
          <table>
            <tr style="text-align:start">
              <td style="width: 6.25rem">
                <span><strong>Test Type</strong></span>
              </td>
              <td style="width: 5rem">
                <span>${firstCentre.type}</span>
              </td>
              <td>
                <span>${secondCentre.type}</span>
              </td>
            </tr>
        `;

    uniqueDays.forEach(uniqueDay => {
      timeTables +=
        `<tr style="text-align:start">
              <td style="width: 6.25rem">
                <span><strong>${uniqueDay}</strong></span>
              </td>
              <td style="width: 5rem">
                <span>${firstOpeningMap.get(uniqueDay) || 'closed'}</span>
              </td>
              <td>
                <span>${secondOpeningMap.get(uniqueDay) || 'closed'}</span>
              </td>
            </tr>`;
    })

    timeTables = timeTables + `
          <tr style="text-align:start">
            <td style="width: 6.25rem">
              <span><strong>Minimum age</strong></span>
            </td>
            <td style="width: 5rem">
              <span>${firstCentre.minimumAge} years</span>
            </td>
            <td>
              <span>${secondCentre.minimumAge} years</span>
            </td>
          </tr>
          <tr style="text-align:start">
            <td style="width: 6.25rem">
              <span><strong>Handicap Parking</strong></span>
            </td>
            <td style="width: 5rem">
              <span>${firstCentre.disabledParking ? 'yes' : 'no'}</span>
            </td>
            <td>
              <span>${secondCentre.disabledParking ? 'yes' : 'no'}</span>
            </td>
          </tr>
          <tr style="text-align:start">
            <td style="width: 6.25rem">
              <span><strong>Allowed for foreigners</strong></span>
            </td>
            <td style="width: 5rem">
              <span>${firstCentre.requiresCprNumber ? 'no' : 'yes'}</span>
            </td>
            <td>
              <span>${secondCentre.requiresCprNumber ? 'no' : 'yes'}</span>
            </td>
          </tr>
        </table>`


    const [c1, c2] = infoMap.get(key);

    const testCentreName = c1.testcenterName === c2.testcenterName ? c1.testcenterName : `${c1.testcenterName}/${c2.testcenterName}`
    const testCentreAddress = c1.address === c2.address ? c1.address : `${c1.address}/${c2.address}`
    return `
  <div>
    <table>
      <tr style="text-align:start">
        <td style="width:6.25rem"><strong>Name:<strong></td>
        <td>${testCentreName}</td>
      </tr>
      <tr style="text-align:start">
        <td style="width:6.25rem"><strong>Company:<strong></td>
        <td>${properties.company}</td>
      </tr>
      <tr style="text-align:start">
        <td style="width:6.25rem"><strong>Address</strong></td>
        <td>${testCentreAddress} </td>
      </tr>
      <tr style="text-align:start">
        <td style="width:6.25rem"><strong>Waiting time</strong></td>
        <td>${c1.waitingTime} / ${c2.waitingTime}</td>
      </tr>
  </table>
  <hr>
  ${timeTables}
  <hr>  
  <table>               
      <tr style="text-align:start">
        <td style="width:6.25rem">
          <a href="${properties.bookingLink}" target="_blank" title="Book time at ${properties.city}">Book time</a>
        </td>
        <td>
         <a href="${properties.directionsLink}" target="_blank" title="Find vej til ${properties.city}">GoogleMap</a>
        </td>
      </tr>
     
  </table>
</div>
</div>
`
  }


  let timeTable = "";


  JSON.parse(properties.openingHours)
    .forEach(time => {
      timeTable +=
        `<tr style="text-align:start">
                                    <td style="width:6.25rem">
                                      <span className="day"><strong>${time.day}</strong></span>
                                    </td>
                                    <td>  
                                      <span className="start">${time.timeStart?.substring(0, 5)}</span> -
                                      <span className="start">${time.timeEnd?.substring(0, 5)}</span>
                                    </td>
                                <tr>`

    });

  timeTable = '<table>' + timeTable + '</table>'


  return (`
            <table>
                <tr style="text-align:start">
                    <td style="width:6.25rem"><strong>Name:<strong></td>
                    <td>${properties.testcenterName}</td>
                </tr>
                <tr style="text-align:start">
                    <td style="width:6.25rem"><strong>Company:<strong></td>
                    <td>${properties.company}</td>
                </tr>
                <tr style="text-align:start">
                    <td style="width:6.25rem"><strong>Type:<strong></td>
                    <td>${properties.type}</td>
                </tr>
                <tr style="text-align:start">
                    <td style="width:6.25rem"><strong>Waiting time:<strong></td>
                    <td>${properties.waitingTime ? properties.waitingTime : 'unknown'}</td>
                </tr>
                <tr style="text-align:start">
                    <td style="width:6.25rem"><strong>Address</strong></td>
                    <td>${properties.address} </td>
                </tr>
            </table>

            <hr>
            ${timeTable}
            <hr>
            <table>
                <tr style="text-align:start">
                    <td style="width:6.25rem"><strong>Min age<strong></td>
                    <td>${properties.minimumAge} years</td>
                </tr>
                <tr style="text-align:start">
                    <td style="width:6.25rem"><strong>Handicap parking<strong></td>
                    <td>${properties.disabledParking ? 'yes' : 'no'}</td>
                </tr>
                <tr style="text-align:start">
                    <td style="width:6.25rem"><strong>Test foreigners<strong></td>
                    <td>${properties.requiresCprNumber ? 'no' : 'yes'}</td>
                </tr>
                <tr style="text-align:start">
                    <td style="width:6.25rem">
                        <a href="${properties.bookingLink}" target="_blank" title="Book time at ${properties.city}">Book time</a>
                    </td>
                    <td>
                        <a href="${properties.directionsLink}" target="_blank" title="Find vej til ${properties.city}">GoogleMap</a>
                    </td>
                </tr>

            </table>
        `);

}

function buildInfoMap(centres) {
  const infoMap = new Map();
  centres.forEach(centre => {
    const key = centre.longitude + "-" + centre.latitude;
    if (!infoMap.has(key)) {
      infoMap.set(key, [centre]);
    } else {
      const existingCentre = infoMap.get(key)
      existingCentre.push(centre)
      infoMap.set(key, existingCentre)
    }
  })

  return infoMap;
}
export default InfoPopup;