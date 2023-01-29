//
//  EULAView.swift
//  damus
//
//  Created by William Casarin on 2023-01-25.
//

import SwiftUI

struct EULAView: View {
    @Environment(\.dismiss) var dismiss
    @State var creating_account = false

    var body: some View {
        ZStack {
            DamusGradient()
            
            ScrollView {
                Text("EULA")
                    .font(.title.bold())
                    .foregroundColor(.white)
                
                Text(Markdown.parse(content: """
End User License Agreement

## Introduction

This End User License Agreement ("EULA") is a legal agreement between you and New Internet Labs Limited. for the use of our mobile application SixT9. By installing, accessing, or using our application, you agree to be bound by the terms and conditions of this EULA.

## Prohibited Content and Conduct

You agree not to use our application to create, upload, post, send, or store any content that:

* Is illegal, infringing, or fraudulent
* Is defamatory, libelous, or threatening
* Is pornographic, obscene, or offensive
* Is discriminatory or promotes hate speech
* Is harmful to minors
* Is intended to harass or bully others
* Is intended to impersonate others

## You also agree not to engage in any conduct that:

* Harasses or bullies others
* Impersonates others
* Is intended to intimidate or threaten others
* Is intended to promote or incite violence

## Consequences of Violation

Any violation of this EULA, including the prohibited content and conduct outlined above, may result in the termination of your access to our application.

## Disclaimer of Warranties and Limitation of Liability

Our application is provided "as is" and "as available" without warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability and fitness for a particular purpose. We do not guarantee that our application will be uninterrupted or error-free. In no event shall New Internet Labs Limited be liable for any damages whatsoever, including but not limited to direct, indirect, special, incidental, or consequential damages, arising out of or in connection with the use or inability to use the application.

## Changes to EULA

We reserve the right to update or modify this EULA at any time and without prior notice. Your continued use of our application following any changes to this EULA will be deemed to be your acceptance of such changes.

## Contact Information

If you have any questions about this EULA, please contact us at damusplus@newinternetlabs.com

## Acceptance of Terms

By using our Application, you signify your acceptance of this EULA. If you do not agree to this EULA, you may not use our Application.

"""))
                .padding()
                
                NavigationLink(destination: CreateAccountView(), isActive: $creating_account) {
                    EmptyView()
                }
                DamusWhiteButton("Accept") {
                    creating_account = true
                }
                
                DamusWhiteButton("Reject") {
                    dismiss()
                }
            }
            .padding()
        }
        .navigationBarTitleDisplayMode(.inline)
        .navigationBarBackButtonHidden(true)
        .navigationBarItems(leading: BackNav())
        .foregroundColor(.white)
    }
}

struct EULAView_Previews: PreviewProvider {
    static var previews: some View {
        EULAView()
    }
}
