//
//  Profiles.swift
//  damus
//
//  Created by William Casarin on 2022-04-17.
//

import Foundation
import UIKit


class Profiles {
    var profiles: [String: TimestampedProfile] = [:]
    var validated: [String: NIP05] = [:]
    var has_name: [String: NIP69] = [:]
    
    func is_validated(_ pk: String) -> NIP05? {
        return validated[pk]
    }
    
    func is_has_name(_ pk: String) -> NIP69? {
        return has_name[pk]
    }
    
    func add(id: String, profile: TimestampedProfile) {
        profiles[id] = profile
    }
    
    func lookup(id: String) -> Profile? {
        return profiles[id]?.profile
    }
    
    func lookup_with_timestamp(id: String) -> TimestampedProfile? {
        return profiles[id]
    }
}
