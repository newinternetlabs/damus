//
//  nip69.js
//  damus
//
//  Created by New Internet Labs Limited on 2023-01-19.
//

function parseZonefileForNostrPubKey(zonefileString) {
    const zonefileObject = parseZoneFile(zonefileString)
    const txtRRs = zonefileObject.txt
    const key = "_._nostr"
    for (i = 0; i < txtRRs.length; i++) {
        console.log(`i: ${i}`)
        
        if(txtRRs[i] && txtRRs[i].name === key) {
            console.log("found nostr pub key")
            return txtRRs[i].txt
        }
    }
    return null
}
