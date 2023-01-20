//
//  NIP69.swift
//  damus
//
//  Created by New Internet Labs Limited on 2023-01-17.
//

import Foundation

struct NIP69 {
    let name: String
    
    let url: URL
    
    let nodeURL = URL(string: "https://stacks-node-api.mainnet.stacks.co")!
    
    init(name: String, url: URL? = nil) {
        self.name = name
        
        if(url != nil) {
            self.url = url!
        } else {
            self.url = URL(string: "\(nodeURL.absoluteString)v1/names/\(name)")!
        }
    }
    
    static func parse(_ nip69: String) -> NIP69? {
        let parts = nip69.split(separator: ".")
        guard parts.count == 2 else {
            print("failed to parse \(nip69) - invalid")
            return nil
        }
        let name = "\(parts[0]).\(parts[1])"
        return NIP69(name: name)
    }
}


struct NIP69Response: Decodable {
    let zonefile: String
}

enum NIP69Validation {
    case invalid
    case valid
}

func validate_nip69(pubkey: String, nip69_str: String) async -> NIP69? {
    
    print("validate_nip69(pubkey: \"\(pubkey)\", nip69_str: \"\(nip69_str)\")")
    guard let nip69 = NIP69.parse(nip69_str) else {
        return nil
    }
    
    let zonefileParser = ZonefileParser()
    print(zonefileParser)
    
    print("using to validate \(nip69.name)")
    print("\(nip69.name) is in expected nip69 format")
    
//    guard let url = nip69.url else {
//        print("invalid url for \(nip69.name)")
//        return nil
//    }
    print(nip69)

 
    print("nip69: fetching zonefile...")
    guard let ret = try? await URLSession.shared.data(from: nip69.url) else {
        print("fetching zonefile for \(nip69.name) failed")
        return nil
    }

    let dat = ret.0
    //print("printing data from nip69 validation endpoint query \(nip69.name) - \(ret)")
    //print(dat)
    
    guard let decoded = try? JSONDecoder().decode(NIP69Response.self, from: dat) else {
        print("nip69: decoding failed")
        return nil
    }
    print("nip69: decoded")
    print(decoded)
    
    guard let namePubKey = zonefileParser.parseZonefileForNostrPubKey(zonefileString: decoded.zonefile) else {
        print("nip69: no nostr pub key found in \(nip69.name) zonefile")
        return nil
    }
    
    print("nip69: pubkey for \(nip69.name) is \(namePubKey)")
    guard namePubKey == pubkey else {
        print("nip69: \(nip69.name)'s pubkey \(namePubKey) does not match profile's pubkey \(pubkey)")
        return nil
    }
    
    return nip69
}
