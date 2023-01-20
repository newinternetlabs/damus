//
//  ZonefileParser.swift
//  damus
//
//  Created by New Internet Labs Limited on 2023-01-18.
//

import JavaScriptCore
import os


class ZonefileParser {
    
    let logger = Logger(subsystem: "io.damus.javascript", category: "zonefile")
    
    let context = JSContext()! //JSContext()!
    
    
    /// Set up the JavaScriptCore context that powers this class
    init() {
        context.exceptionHandler = { context, exception in
            if let exception = exception {
                self.logger.error("JSContext exception: \(exception)")
            }
        }
        if let path = Bundle.main.path(forResource: "zone-file-1.0.0", ofType: "js"),
           let coreJS = try? String(contentsOfFile: path) {
            let _result = context.evaluateScript(coreJS)!
        }
        
        if let path = Bundle.main.path(forResource: "nip69", ofType: "js"),
           let nip69JS = try? String(contentsOfFile: path) {
            let _result = context.evaluateScript(nip69JS)
        }
    }
    
    
    /// Parses the provided zonefile string for a txt record with the appropriate NIP69 nostr key and returns the associated nostr pub key
    /// - Parameter String: the string containing the zonefile
    /// - Returns: String containing the nostr pub key or nil if no nostr pub key was found
        func parseZonefileForNostrPubKey(zonefileString: String) -> String? {
            let jsParseZonefileForNostrPubKey = context.objectForKeyedSubscript("parseZonefileForNostrPubKey")!
            let jsValue = jsParseZonefileForNostrPubKey.call(withArguments: [zonefileString])
            logger.debug("pubkey from zonefile: \(jsValue?.toString() ?? "no nostr pub key found in zonefile")")
            return jsValue?.toString() ?? nil
        }
    
}
