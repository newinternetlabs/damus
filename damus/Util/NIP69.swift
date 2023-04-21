//
//  NIP69.swift
//  damus
//
//  Created by New Internet Labs Limited on 2023-01-17.
//

import Foundation

struct NIP69 {
    let name: String
    
    static let DEFAULT_NODE_URL = URL(string: "https://nostrnames.org/api/names/")!
    
    init(name: String) {
        self.name = name
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
    let hex: String
    let npub: String
}

enum NIP69Validation {
    case invalid
    case valid
}

func retrieve_pubkey_for_name(name: String) async -> NIP69Response? {
    print("retrieve_pubkey_for_name(\(name)")
    guard let nip69 = NIP69.parse(name) else {
        return nil
    }
    
//    guard let url = nip69.url else {
//        print("invalid url for \(nip69.name)")
//        return nil
//    }
    print(nip69)
    let userSettings = UserSettingsStore()
    let userNodeURL = URL(string: userSettings.bns_node.self)

    
    let nodeURL: URL = userNodeURL == nil ? NIP69.DEFAULT_NODE_URL : userNodeURL!
 
    guard let url = URL(string: "\(nodeURL.absoluteString)\(nip69.name)") else {
        print("generating lookup url for \(nip69.name) failed")
        return nil`
    }
    print("nip69: fetching public key using node: \(url)")
    guard let ret = try? await URLSession.shared.data(from: url) else {
        print("fetching public key for \(nip69.name) failed")
        return nil
    }

    let dat = ret.0
    print("printing data from nip69 validation endpoint query \(nip69.name) - \(ret)")
    print(dat)
    
    guard let decoded = try? JSONDecoder().decode(NIP69Response.self, from: dat) else {
        print("nip69: decoding failed")
        return nil
    }
    print("nip69: decoded")
    print(decoded)
    return decoded
}

func validate_nip69(pubkey: String, name: String) async -> NIP69? {
    print("validate_nip69(pubkey: \"\(pubkey)\", name: \"\(name)\")")

    
    let response: NIP69Response? = await retrieve_pubkey_for_name(name: name)
    
    guard let namePubkey = response else {
        print("no nostr public key for \(name)")
        return nil
    }
    
    guard let nip69 = NIP69.parse(name) else {
        return nil
    }
    
    print("nip69: pubkey for \(nip69.name) is \(namePubkey.hex)")
    if pubkey != namePubkey.hex {
        print("nip69: \(nip69.name)'s pubkey \(namePubkey.hex) does not match profile's pubkey \(pubkey)")
        return nil
    }
    
    return nip69
}
