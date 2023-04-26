//
//  NIP69Badge.swift
//  damus
//
//  Created by Larry Salibra on 2023-01-17.
//

import SwiftUI

struct NIP69Badge: View {
    let nip69: NIP69
    let pubkey: String
    let contacts: Contacts
    let clickable: Bool
    
    @Environment(\.openURL) var openURL
    
    init (nip69: NIP69, pubkey: String, contacts: Contacts, clickable: Bool) {
        self.nip69 = nip69
        self.pubkey = pubkey
        self.contacts = contacts
        self.clickable = clickable
    }
    
    
    var body: some View {
        HStack(spacing: 2) {
            LINEAR_GRADIENT
                .mask(Image(systemName: "checkmark.seal.fill").resizable()
                ).frame(width: 14, height: 14)
                .font(.footnote)

        }

    }
}

func get_nip69_color(pubkey: String, contacts: Contacts) -> Color {
    return contacts.is_friend_or_self(pubkey) ? .accentColor : .gray
}

struct NIP69Badge_Previews: PreviewProvider {
    static var previews: some View {
        let test_state = test_damus_state()
        NIP69Badge(nip69: NIP69(name: "larry.btc"), pubkey: test_state.pubkey, contacts: test_state.contacts, clickable: false)
    }
}

