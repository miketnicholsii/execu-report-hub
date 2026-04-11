import { RawSourceRow } from "@/lib/cfs/model";

export const rawSourceRows: RawSourceRow[] = 
[
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "High",
      "topic": "S9 Recall Report Not Displaying Information in Available Inventory",
      "site": "Banks Cold Storage",
      "rm_reference": "13548",
      "status": "Testing Complete",
      "context_details": "BB supplied the following information reported by Banks.\nWhen running the FG Recall report, the Available Inventory section was blank. This indicates to the user that there are no more cases/pallets in inventory from the PO that was searched. For this PO that was searched, that Recall report is incorrect for that section. This error was verified when searching the pallets that are in inventory that were received against that PO.",
      "last_update": "2026-03-02 00:00:00",
      "notes": "Once deployed to test server will need to get with Josh on how to test.",
      "next_steps": "Deploy to test server"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Medium",
      "topic": "Cannot Add Status Code to Serial When No Status is Applied in Status Code Update Screen",
      "site": "Banks Cold Storage",
      "rm_reference": "13522",
      "status": "Moved To Programming",
      "context_details": "Banks reported an issue where the FG Inventory report displayed \"No Status\" for a product code.\nWhile researching I attempted to add the status code with the Status Code Update screen but was not able to find the serials with the search box due to not having a status code applied.",
      "last_update": "2026-02-16 00:00:00",
      "notes": "Followed up with HD. Added HD notes to RM"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Medium",
      "topic": "S9 - Reason Code Setup Screen",
      "site": "Banks Cold Storage",
      "rm_reference": "13432",
      "status": "Moved To Programming",
      "last_update": "2026-02-25 00:00:00",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Medium",
      "topic": "S9 - Status Update Comments",
      "site": "Banks Cold Storage",
      "rm_reference": "13431",
      "status": "Moved To Programming",
      "last_update": "2026-02-25 00:00:00",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Medium",
      "topic": "S9 Nimbus - Reassign NSP",
      "site": "Banks Cold Storage",
      "rm_reference": "13370",
      "status": "Testing Active",
      "last_update": "2026-02-25 00:00:00",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Medium",
      "topic": "S9 - Add Vendor Group Screen and Database",
      "site": "Banks Cold Storage",
      "rm_reference": "13369",
      "status": "Testing Active",
      "last_update": "2026-02-25 00:00:00",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Medium",
      "topic": "S9 - Add fields to FG Inventory Report",
      "site": "Banks Cold Storage",
      "rm_reference": "13263",
      "status": "Moved To Programming",
      "last_update": "2026-02-25 00:00:00",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Medium",
      "topic": "Pallet History Report",
      "site": "Banks Cold Storage",
      "rm_reference": "13133",
      "status": "Testing Complete",
      "next_steps": "Deploy to test server"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "High",
      "topic": "S9 Renewal Charge Functionality and Interface DB Update",
      "site": "Banks Cold Storage",
      "rm_reference": "12846",
      "status": "Testing Active",
      "last_update": "2026-03-25 00:00:00",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Medium",
      "topic": "Request to Pick by Lot",
      "site": "Banks Cold Storage",
      "status": "Waiting on Info",
      "context_details": "BCS will need free form field for filter. How do we handle multiple lots?",
      "last_update": "2026-02-24 00:00:00",
      "notes": "Schedule a call to discuss"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Low",
      "topic": "S9 - Incorporate PT8 RF Cancel / Reprint into S9",
      "site": "Banks Cold Storage",
      "rm_reference": "13420",
      "status": "Testing Active",
      "next_steps": "Deploy to test server"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Low",
      "topic": "Nimbus Break Pallet Function",
      "site": "Banks Cold Storage",
      "rm_reference": "12230",
      "status": "Testing Active",
      "next_steps": "Deployment"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Low",
      "topic": "S9 Receive by Date Function in Nimbus",
      "site": "Banks Cold Storage",
      "rm_reference": "12223",
      "status": "Quote Sent",
      "last_update": "2026-02-16 00:00:00",
      "notes": "Quoted and followed up. No response from BCS."
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "Medium",
      "topic": "Break Pallet Weights Changing When Picked",
      "site": "Banks Cold Storage",
      "rm_reference": "13685",
      "status": "Testing Active",
      "context_details": "BCS reported a pallet showed the wrong weight on the load diagram for a pallet that had cases broken onto it.",
      "last_update": "2026-03-19 00:00:00"
    }
  },
  {
    "source_file": "Banks_Cold_Storage_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Banks Cold Storage",
      "priority": "High",
      "topic": "S9 Inventory Movement Report",
      "site": "Banks Cold Storage",
      "rm_reference": "8928",
      "status": "Deployed",
      "context_details": "Error code showing when trying to pull up report",
      "last_update": "2026-03-16 00:00:00",
      "notes": "Sent email to BCS 3/16 to test on test server",
      "next_steps": "Deploy to live server"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "Cancel / Reprint \u2013 Unable to Correct Receiving Errors & Reprint Blox",
      "site": "Braswell",
      "rm_reference": "RM 13421",
      "status": "In-Testing",
      "context_details": "Braswell unable to correct receiving errors and unable to reprint blox labels. Both tied to Cancel/Reprint functionality.",
      "last_update": "2026-03-09 00:00:00",
      "target_eta": "2026-03-24 00:00:00",
      "notes": "3/5 update: Will be included in the release with the secondary label update. 3/9 - In deliverables, it was discussed that there was an issue found during cancel/reprint that could impact timing.",
      "next_steps": "Provide ETA; complete development & deploy"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "Secondary Label fails to print",
      "site": "Braswell",
      "rm_reference": "RM 13634",
      "status": "In-Testing",
      "context_details": "While testing Receive, we discovered the secondary label functionally fails to print the label defined by they crossref.",
      "last_update": "2026-03-09 00:00:00",
      "target_eta": "2026-03-24 00:00:00",
      "notes": "3/5 update: Nimbus development completed, but the Printer Service portion is not. Development requires 3 days for printer service, 3/5 is day one 3/9 - No issue found to date with this functionality but is associated with Cancel/Reprint so timing may be impacted",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "QERP - Cases Per Pallet",
      "site": "Braswell",
      "rm_reference": "RM 13623",
      "status": "Complete",
      "context_details": "Cases per pallet are not populating due to the value sent down from the Interface is populating the NVP field instead of the designated field for cases per pallet. An update to QERP is required to address.",
      "last_update": "2026-03-11 00:00:00",
      "target_eta": "2026-03-24 00:00:00",
      "notes": "3/5 update: Development has begun\n3/13 EK Tested - Passed",
      "next_steps": "Update to QERP required."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "FG vs PT Duplication / Product Linking Cleanup",
      "site": "Braswell",
      "rm_reference": "RM 13579",
      "status": "Complete",
      "context_details": "The Q-ERP will populate the FGProduct record's ItemCode column only when creating the FGProduct for the first time. If the FGProduct is updating an existing record, the ItemCode is not populated. We need to update the program to update the ItemCode.",
      "last_update": "2026-03-05 00:00:00",
      "target_eta": "2026-03-24 00:00:00",
      "notes": "Update to allow the itemcode assigned to an existing FG product code to be updated.\n\n3/5 update: Ready to test on the Braswell test server .22 @ CFS\n3/11 - EK Testing (DEV side testing complete)",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "Combine / UnCombine / Master Pallet Function",
      "site": "Braswell",
      "rm_reference": "RM 13589 (UnCombine)",
      "status": "Moved To Programming",
      "context_details": "Combine available; UnCombine in development/testing; Master pallet function requested.",
      "last_update": "2026-03-05 00:00:00",
      "target_eta": "2026-03-24 00:00:00",
      "notes": "Need confirmed release date.\n\n3/5 update: Confirmed to be in development. No new news on a date",
      "next_steps": "Provide ETA for UnCombine; confirm Master pallet scope\nNext printing Combine Label"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "PT Only Product Should Not Create FG Product by QERP - Braswell Eggs Nashville",
      "site": "Braswell",
      "rm_reference": "RM 13597",
      "status": "Complete",
      "context_details": "Based off of current Interface logic, product codes sent from Interface are created in Inven if the UCC and ERPProductCode is populated. Current  logic ignores the Product Type.",
      "last_update": "2026-03-05 00:00:00",
      "target_eta": "2026-03-24 00:00:00",
      "notes": "3/5 update: Ready to test on the Braswell test server .22 @ CFS",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "SSCC18 Barcode Content Confirmation",
      "site": "Braswell",
      "rm_reference": "TBD",
      "status": "In Progress",
      "context_details": "Confirm SSCC barcode content for Braswell customer.",
      "last_update": "TBD",
      "target_eta": "2026-03-18 00:00:00",
      "notes": "Await customer confirmation.",
      "next_steps": "Follow up"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "SSCC18 \u2013 Q6 Database",
      "site": "Braswell",
      "rm_reference": "RM 13376",
      "status": "Complete",
      "context_details": "Add SSCC18 field to Q6 DB.",
      "last_update": "2026-03-05 00:00:00",
      "target_eta": "2026-03-18 00:00:00",
      "notes": "Quote sent.\n3/5 update: No new news\n3/11 - EK Testing (DEV side testing complete)",
      "next_steps": "Await approval"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "SSCC18 \u2013 Interface Database",
      "site": "Braswell",
      "rm_reference": "RM 13377",
      "status": "Complete",
      "context_details": "Add SSCC18 & SellByDate to Interface DB. RM13426 rolled in & closed.",
      "last_update": "2026-03-05 00:00:00",
      "target_eta": "2026-03-18 00:00:00",
      "notes": "3/5 update: No new news\n3/11 - EK Testing (DEV side testing complete)",
      "next_steps": "Await approval"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "SSCC18 \u2013 Plant Messenger",
      "site": "Braswell",
      "rm_reference": "RM 13378",
      "status": "Complete",
      "context_details": "Add SSCC18 field.",
      "last_update": "TBD",
      "target_eta": "2026-03-18 00:00:00",
      "notes": "3/5 update: In testing\n3/11 - EK Testing (DEV side testing complete)",
      "next_steps": "Await approval"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "SSCC18 \u2013 Q Listener",
      "site": "Braswell",
      "rm_reference": "RM 13379",
      "status": "Complete",
      "context_details": "Add SSCC18 & SellByDate. RM13427 rolled in & closed.",
      "last_update": "TBD",
      "target_eta": "2026-03-18 00:00:00",
      "notes": "3/11 - EK Testing (DEV side testing complete)",
      "next_steps": "Await approval"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Manifest Generation \u2013 Auto Number",
      "site": "Braswell",
      "rm_reference": "TBD",
      "status": "On Hold",
      "context_details": "Automatically generate manifest number.",
      "last_update": "TBD",
      "target_eta": "TBD",
      "notes": "WJ to send summary + obtain dev estimate.",
      "next_steps": "Obtain dev estimate"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "SSS (Simple Scan Station) Upgrade",
      "site": "Braswell",
      "rm_reference": "TBD",
      "status": "In Progress",
      "context_details": "SSS upgrade required prior to full S9 go-live.",
      "last_update": "TBD",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Plan upgrade timeline"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Trailer Receipt \u2013 Testing & Validation",
      "site": "Braswell",
      "rm_reference": "TBD",
      "status": "In Progress",
      "context_details": "Instructions sent; Braswell has not tested yet. Additional FG-specific test required.",
      "last_update": "2026-01-27 00:00:00",
      "target_eta": "TBD",
      "notes": "While testing, FG Trailer Receipt didn't display in S9 Reports",
      "next_steps": "Waiting on feedback from Dev team."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 16,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Scan UPC Field Repurpose",
      "site": "Braswell",
      "status": "In Progress",
      "context_details": "Determine if UPC field can be repurposed for Item Code.",
      "last_update": "TBD",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Test + confirm"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 17,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "CFS On-site Support",
      "site": "Braswell",
      "rm_reference": "TBD",
      "status": "In Progress",
      "context_details": "Determine if on-site support required and estimate dates.",
      "last_update": "TBD",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Confirm need"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 18,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Low",
      "topic": "Receiving Date Not Editable",
      "site": "Braswell",
      "rm_reference": "TBD",
      "status": "On Hold",
      "context_details": "Receiving date cannot be modified. Requires additional development; Braswell does not want to proceed.",
      "last_update": "TBD",
      "notes": "Customer declined change.",
      "next_steps": "No action unless reprioritized"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 19,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Low",
      "topic": "Error in Receive \u2013 Pallet # Not Provided",
      "site": "Braswell",
      "rm_reference": "RM 13502",
      "status": "Moved To Programming",
      "context_details": "Error: \u201cCannot Print Label. Pallet Number is not provided.\u201d Serial count exceeded scale max; affects \u201cReceive another like this.\u201d",
      "last_update": "TBD",
      "target_eta": "TBD",
      "notes": "Confirmation screen logic to be modified.",
      "next_steps": "Fixed in Nimbus, but will need to be a complete release"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 20,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Manifest Duplication (\u201cFG, FG\u201d)",
      "site": "Braswell",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "Manifest displays duplicate values (example: \u201cFG, FG\u201d).",
      "last_update": "TBD",
      "target_eta": "TBD",
      "notes": "Awaiting confirmation of testing findings.",
      "next_steps": "Confirm testing; schedule deployment"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 21,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Test FG Pallet Label (Item Code vs Product Code)",
      "site": "Braswell",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "Print Item Code instead of Product Code on FG pallet label.",
      "last_update": "TBD",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Confirm mapping; test"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 22,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Configure 3 Scanners for S9",
      "site": "Braswell",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "Configure 3 scanners to connect to S9.",
      "last_update": "TBD",
      "target_eta": "TBD",
      "notes": "Config file sent by Help Desk.",
      "next_steps": "Confirm connectivity"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 23,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "\u2014",
      "topic": "QERP - Product Interface",
      "site": "\u2014",
      "rm_reference": "RM 13597",
      "status": "Testing Complete",
      "context_details": "Update Product Validation Rules",
      "last_update": "2026-03-11 00:00:00",
      "target_eta": "TBD",
      "notes": "3/11 -  EK Tested - Passed",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 24,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "\u2014",
      "topic": "PT Field Configuration",
      "site": "\u2014",
      "rm_reference": "RM 13563",
      "status": "Complete",
      "context_details": "PT Field Configuration Not Transferring to S9 From Q6",
      "last_update": "2026-03-11 00:00:00",
      "target_eta": "TBD",
      "notes": "3/11 -  EK Tested - Passed \n(showed \"1's\" as anticipated)",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "Barcode Showing \u201c\u201d",
      "site": "Braswell",
      "rm_reference": "TBD",
      "status": "Complete",
      "context_details": "Barcode text displayed \u201c\u201d. Corrected and resolved.",
      "last_update": "2026-01-28 00:00:00",
      "target_eta": "\u2014",
      "notes": "Confirmed resolved 1/28/26."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "Blox UOM Defaulting to First PO Line",
      "site": "Braswell",
      "rm_reference": "Issue 13529",
      "status": "Complete",
      "context_details": "Blox UOM defaulted to first PO line.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "Referenced issue 13529."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "Issues Receiving Purchased Finished Goods",
      "site": "Braswell",
      "rm_reference": "Issue 13511",
      "status": "Complete",
      "context_details": "Purchased FG receiving issue resolved.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "Referenced issue 13511."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Needing Aeros to Drive CFS Master Data",
      "site": "Braswell",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "Master data ownership clarified; tied to Receiving fields discussion.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Duplicate Manifest Numbers",
      "site": "Braswell",
      "rm_reference": "RM 13421",
      "status": "Complete",
      "context_details": "Manifest error when using existing number tied to different PO.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Update Braswell Blox Label",
      "site": "Braswell",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "Vendor name extending to second label corrected; .lbl placed 1/26.",
      "last_update": "2026-01-26 00:00:00",
      "target_eta": "\u2014",
      "notes": "Awaited feedback."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "S9 Receive \u2192 Reprint Delete Error",
      "site": "Braswell",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "Delete selection error resolved.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Add New Locations (R8 \u2192 S9)",
      "site": "Braswell",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "Locations added successfully.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Update Receive Prompts (Lot & Use By Required)",
      "site": "Braswell",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "FG product types updated to require Vendor Lot & Use By Date.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Nimbus Operators & Permissions",
      "site": "Braswell",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "Operators added; CEC Admin group created.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Bulk Update \u2013 Receiving Fields",
      "site": "Braswell",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "Bulk update performed per Braswell specifications.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "Nimbus Not Loading (Unhealthy Container)",
      "site": "Braswell",
      "rm_reference": "RM-13543",
      "status": "Complete",
      "context_details": "Container issue deployed; TK#97243.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "Deployed"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "Medium",
      "topic": "Blox Label Not Scanable",
      "site": "Braswell",
      "rm_reference": "TK97141",
      "status": "Complete",
      "context_details": "Successful print & scan 1/29.",
      "last_update": "2026-01-29 00:00:00",
      "target_eta": "\u2014",
      "notes": "Verified."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "priority": "High",
      "topic": "Receiving Fields Reverting to \u201cNo\u201d (PT Setup)",
      "site": "Braswell",
      "rm_reference": "TK#97244",
      "status": "Complete",
      "context_details": "ExpirationDateReq & LotReq coming from Aeros as NULL disables fields in S9. Braswell does not want to manage via Aeros. Only FG should require Lot/Expiration.",
      "last_update": "TBD",
      "target_eta": "TBD",
      "notes": "Aeros made an update send flag for ExpirationDate and LotReq",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "CFS",
      "topic": "Test FG Pallet Label",
      "status": "Open"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "Braswell/CFS",
      "topic": "Configure scanners to connect to S9",
      "status": "Open",
      "notes": "CFS Help Desk sent instructions and config file."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "Braswell",
      "topic": "Update to Braswell Blox label",
      "status": "Complete",
      "notes": "Latest .lbl file placed on Braswell server or 1/26. \nPending their feedback on a test print."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Task",
      "owner": "CFS",
      "topic": "Update SSS (Simple Scan Station)",
      "status": "Open"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Task",
      "owner": "CFS",
      "topic": "Trailer Receipt steps",
      "status": "Open",
      "notes": "BB tested on 1/27. DK noted \"remove the Inventory filter and add the location type\""
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Bug",
      "topic": "Error with duplicate Manifest Numbers",
      "status": "Complete",
      "rm_reference": "RM 13421"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Bug",
      "owner": "Braswell",
      "topic": "Error in Receive",
      "status": "Open",
      "rm_reference": "RM 13502",
      "notes": "Error was caused by the number of serial records created. Exceeded maximum number for Scale. \n\n\u2022CFS to change Confirmation screen for \"Receive another like this?\""
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Bug",
      "owner": "CFS",
      "topic": "S9 Receive --> Reprint",
      "status": "Complete",
      "rm_reference": "TBD"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "CFS",
      "topic": "Add New locations",
      "status": "Complete"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "CFS",
      "topic": "SSCC18 Field",
      "status": "Quote Sent",
      "rm_reference": "RM 13376",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "CFS",
      "topic": "SSCC18 Field",
      "status": "Quote Sent",
      "rm_reference": "RM 13377",
      "notes": "RM 13426  rolled into SCC18 ticket as requested & closed."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "CFS",
      "topic": "SSCC18 Field",
      "status": "Quote Sent",
      "rm_reference": "RM 13378",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "CFS",
      "topic": "SSCC18 Field",
      "status": "Quote Sent",
      "rm_reference": "RM 13379",
      "notes": "RM 13427  rolled into SCC18 ticket as requested & closed."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "CFS",
      "topic": "Nimbus Cancel Reprint",
      "status": "In Testing",
      "rm_reference": "RM 13421"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 16,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "CFS",
      "topic": "Manifest Generation",
      "status": "Open",
      "rm_reference": "TBD",
      "notes": "WJ to send summary and obtain dev estimates."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 17,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "CFS",
      "topic": "SSCC Barcode",
      "status": "Open",
      "rm_reference": "TBD",
      "notes": "Await customer confirmation."
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 18,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Request",
      "owner": "CFS",
      "topic": "Update Receive Promts",
      "status": "Complete"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 19,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Bug",
      "owner": "CFS",
      "topic": "Nimbus Operators and Permissions",
      "status": "Complete",
      "notes": "Note: No permissions needed for \"Jay\" and a general \"CEC Admin\" group is needed (Carolina Egg Co.)"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 20,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Bug",
      "owner": "CFS",
      "topic": "Nimbus - \"Recieve another like this\" - Use by Date",
      "status": "Open",
      "rm_reference": "TBD"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 21,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Task",
      "owner": "Braswell",
      "topic": "Bulk update",
      "status": "Complete",
      "rm_reference": "TBD"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 22,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Task",
      "owner": "CFS",
      "topic": "Palletizing Braswell Egg Cartons (Blox)",
      "status": "Open",
      "notes": "http://10.10.200.146/issues/13150"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 23,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Task",
      "owner": "CFS",
      "topic": "Inventory Locations",
      "status": "Complete"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 24,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Question",
      "owner": "CFS",
      "topic": "Scan UPC Code",
      "status": "Open",
      "notes": "CFS to Test"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 25,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Task",
      "owner": "Braswell",
      "topic": "Units per Pallet",
      "status": "Open"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 26,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Task",
      "owner": "CFS",
      "topic": "CFS On-site",
      "status": "Open"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 28,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Bug",
      "owner": "CFS",
      "topic": "Nimbus not Loading",
      "status": "Complete",
      "rm_reference": "RM-13543 / TK#97243",
      "notes": "Deployed"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 29,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Bug",
      "owner": "CFS",
      "topic": "Nimbus Receive Function",
      "status": "In Programming?",
      "rm_reference": "RM-TBD",
      "notes": "Asked team: Still in Programming? Any new news?"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 30,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Bug",
      "owner": "CFS",
      "topic": "Manifest Duplication",
      "status": "Pending Deployment",
      "rm_reference": "RM-TBD",
      "notes": "Asked team: Any new testing findings?"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 31,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Bug",
      "owner": "CFS",
      "topic": "Receiving",
      "status": "Open",
      "rm_reference": "TK#97244 / RM-TBD",
      "notes": "Help Desk has been unable to recreate issue"
    }
  },
  {
    "source_file": "Braswell_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 32,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Braswell",
      "category": "Bug",
      "owner": "CFS",
      "topic": "Blox Label not Scanable",
      "status": "Complete",
      "rm_reference": "TK97141",
      "notes": "Successful print and scan by D at Braswell at 1/29"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Order LPQ",
      "site": "Farmerville",
      "rm_reference": "RM-13661",
      "status": "In Programming",
      "context_details": "Order detail not updated to correct count - Case Farms Farmerville",
      "last_update": "2026-04-10 00:00:00",
      "target_eta": "\u2014",
      "notes": "\u2014",
      "next_steps": "Reviewing database snapshots. Currently unable to replicate the error. 3/27 -  Projects to connect w/ CFS Dev on topic."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Farmerville ASN fails to load into FG properly",
      "site": "Farmerville",
      "rm_reference": "RM-13600",
      "status": "Testing Active",
      "context_details": "\u2014",
      "last_update": "2026-04-10 00:00:00",
      "target_eta": "\u2014",
      "notes": "\u2014",
      "next_steps": "Finish development changes"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "S9 Upgrade \u2013 Winesburg First",
      "site": "Winesburg",
      "rm_reference": "PO Provided",
      "status": "Planned",
      "context_details": "PO received. Winesburg first upgrade; Canton last. Est. 1 week server setup + 1 week testing. Shipping docs TBD.",
      "last_update": "2025-09-25 00:00:00",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Confirm shipping documents; finalize schedule; determine Winesburg shipping docs"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Node Core Failure When Receiving in PT Product in Receive By Date \u2013 Farmerville",
      "site": "Farmerville",
      "rm_reference": "RM-13572",
      "status": "Testing Active",
      "context_details": "Node core failure when receiving PT product in Receive By Date.",
      "last_update": "2026-04-10 00:00:00",
      "target_eta": "TBD",
      "notes": "Deployment requires 1.5 days of downtime.",
      "next_steps": "Schedule downtime; deploy fix"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Node Core Failure \u2013 PT Receiving",
      "site": "Farmerville",
      "rm_reference": "RM-13572",
      "status": "Testing Active",
      "context_details": "\u201cTransaction Aborted\u201d when receiving PT product; Node Core failure logged.",
      "last_update": "2026-04-10 00:00:00",
      "target_eta": "\u2014",
      "notes": "Backend service failure.",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Recieving in to PT throws an error. Recieving a Blox",
      "site": "Farmerville",
      "rm_reference": "RM-13572",
      "status": "Testing Active",
      "context_details": "System throws an error when they try to receive",
      "last_update": "2026-04-10 00:00:00",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "FG Recieve - ASN",
      "site": "Farmerville",
      "rm_reference": "RM-13688",
      "status": "In-Spec",
      "context_details": "Recieve by date ASN flow is not tailored for ASN receiving",
      "last_update": "2026-04-10 00:00:00",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Currently in the process of gathering use cases when receiving ASN"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "SD Cards for ACS for 2, 3 and 4",
      "site": "Winesburg",
      "rm_reference": "\u2014",
      "status": "Waiting on Case Farms",
      "context_details": "Upgrade to the latest ACS version: swap out SD cards 1 with new version and one with old version",
      "last_update": "\u2014",
      "target_eta": "\u2014",
      "notes": "Quote for SD cards; How many cards needed.",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Print Customer Product on BOL",
      "site": "Farmerville",
      "rm_reference": "\u2014",
      "status": "Waiting on Case Farms",
      "context_details": "Update S9 BOL to printer customer product",
      "last_update": "2026-03-25 00:00:00",
      "target_eta": "\u2014",
      "notes": "\u2014",
      "next_steps": "Kim to add Cust Product Codes and Test"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Failed Print Jobs (Network Batch Printers)",
      "site": "Farmerville",
      "rm_reference": "\u2014",
      "status": "\u2014",
      "context_details": "Updates to printer settings, ( Energy Saving Sleep Timeout setting of 0)",
      "last_update": "2026-03-27 00:00:00",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "S9 Published reports failing to save",
      "site": "\u2014",
      "rm_reference": "RM -13643",
      "status": "In-Programming",
      "context_details": "\u2014",
      "last_update": "2026-04-10 00:00:00",
      "target_eta": "\u2014",
      "notes": "Inventory Movement report (fix in testing)\nCooked Raw (pending)",
      "next_steps": "The RM (13643) is completed but there is a correlating piece that has not been deployed yet regarding refreshing the grid"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "SCC18 Pallet Labels (EDI Customers)",
      "site": "\u2014",
      "status": "Waiting on Customer",
      "context_details": "Dynamic SCC18 pallet label format finalized. Deployed to Farmerville; unclear if deployed to other plants. Uses ship-to customer data.",
      "last_update": "2025-09-25 00:00:00",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Plan deployment to other locations"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "SOP \u2013 Offsite Blast Freezer (Farmerville) Ship & Return",
      "site": "Farmerville",
      "status": "Additional Discusstion Required",
      "context_details": "Need SOP/process to ship product to offsite blast freezer and return to plant.",
      "last_update": "2025-09-25 00:00:00",
      "target_eta": "TBD",
      "notes": "CFS to call Kim on 02/02/2026 to discuss",
      "next_steps": "Draft SOP"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "SOP \u2013 Offsite (Goldsboro) Ship & Return",
      "site": "Goldsboro",
      "status": "Additional Discusstion Required",
      "context_details": "Front halfs > Boneless/Trime",
      "last_update": "2025-09-26 00:00:00",
      "target_eta": "TBD",
      "notes": "CFS to call Kim on 02/02/2026 to discuss",
      "next_steps": "Draft SOP"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 16,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Goldsboro VRT PC Services Stopping",
      "site": "Goldsboro",
      "rm_reference": "RM-13008",
      "status": "Waiting on Customer",
      "context_details": "PM2 processes stopping; serials not moving through VRT. New VM built by CF; downtime required to cut over.",
      "last_update": "2026-04-10 00:00:00",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Configure VM; coordinate cutover window"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 17,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Add PDN Search to Serial Audit",
      "site": "Farmerville",
      "rm_reference": "RM-13591",
      "status": "In-Spec",
      "context_details": "Request to search Serial Audit by PDN source code.",
      "last_update": "2026-04-10 00:00:00",
      "target_eta": "TBD",
      "notes": "Reporting enhancement.",
      "next_steps": "Confirm requirements and move to dev."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 18,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "Case to Pallet Validation",
      "site": "Goldsboro",
      "rm_reference": "\u2014",
      "status": "Additional Discusstion Required",
      "context_details": "With Case to Pallet validation enabled, Farmerville is unable to Move or PutAway pallets received in from a Vendor",
      "last_update": "2026-03-17 00:00:00",
      "notes": "The Goldsboro process is to do a putaway. Challenge is being able to distinguish the product received in versus what was made in-house",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 19,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "Open question regarding preventing users from moving products to Ghost location",
      "site": "\u2014",
      "rm_reference": "\u2014",
      "status": "On Hold",
      "context_details": "\u2014",
      "last_update": "2026-03-13 00:00:00",
      "target_eta": "\u2014",
      "notes": "\u2014",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 20,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "Winesburg Zone Project (Go-Live\nMorganton Zone Project (Go-Live",
      "site": "Winesburg",
      "rm_reference": "\u2014",
      "status": "Waiting on Customer",
      "context_details": "\u2022 Export from Winesburg Scale for Zone SLC\n\u2022 Updated Drawing to be added to overall Drawing\n\u2022Request for Spare Parts list from CFS",
      "last_update": "\u2014",
      "target_eta": "\u2014",
      "notes": "\u2014",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 21,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "BloxLog Split Issue",
      "site": "\u2014",
      "rm_reference": "RM-12215",
      "status": "On Hold",
      "context_details": "Split shows Split-In without Split-Out. Plant not using feature; deprioritized.",
      "last_update": "2026-04-10 00:00:00",
      "notes": "\u2014",
      "next_steps": "Check status when bandwidth allows. Low Priority for Case Farms."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 22,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "ACS & Reject Project \u2013 Goldsboro",
      "site": "Goldsboro",
      "status": "Planned",
      "context_details": "Quote sent; deprioritized.",
      "last_update": "2025-09-25 00:00:00",
      "notes": "\u2014",
      "next_steps": "Kim to follow up with Nicole and Kevin"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 23,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "QA Hold \u2013 Add Note Field",
      "site": "\u2014",
      "status": "Waiting on Customer",
      "context_details": "Request to add note field when placing product on QA hold. New development required; low priority.",
      "last_update": "2025-09-25 00:00:00",
      "notes": "\u2014",
      "next_steps": "Spec and quote if priority increases"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 24,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "Automatically Apply Hold Status to Product Code",
      "site": "\u2014",
      "status": "Waiting on Customer",
      "context_details": "Prevent test product codes from shipping. Options discussed; not spec\u2019d.",
      "last_update": "2025-09-25 00:00:00",
      "notes": "\u2014",
      "next_steps": "No action unless prioritized"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 25,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "Rebound Project (Disaster Recovery Plan)",
      "site": "\u2014",
      "status": "Waiting on Customer",
      "context_details": "Removed from CF consideration due to ROI concerns; may revisit post-S9.",
      "last_update": "2025-09-25 00:00:00",
      "notes": "Case Farms discussed holding off until upgrade to S9.",
      "next_steps": "Revisit post-upgrade"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Open",
    "source_row": 26,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "Request for Recommend list of Spare Parts",
      "site": "Winesburg",
      "status": "\u2014",
      "context_details": "Refer to quote",
      "last_update": "\u2014",
      "target_eta": "\u2014",
      "notes": "\u2014",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13423",
      "site": "Case Farms, Farmerville",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13446",
      "site": "Case Farms, Farmerville",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13486",
      "site": "Case Farms, Farmerville",
      "topic": "Deployed",
      "notes": "Update to Plant Messenger script"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13496",
      "site": "Case Farms, Farmerville",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13503",
      "site": "Case Farms, Farmerville",
      "topic": "Deployed",
      "testing_status": "Yes"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13568",
      "site": "Case Farms, Farmerville",
      "topic": "Deployed",
      "testing_status": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13570",
      "site": "Case Farms, Farmerville",
      "topic": "Deployed",
      "testing_status": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "12984",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13131",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13144",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13145",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13146",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13147",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13148",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 16,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13150",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 17,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13154",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed",
      "testing_status": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 18,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13177",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 19,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13181",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 20,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13182",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 21,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13183",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 22,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13186",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 23,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13187",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 24,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13188",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 25,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13192",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed",
      "notes": "Estimated to be ready by deployment date"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 26,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13199",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 27,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13200",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 28,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13201",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 29,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13202",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 30,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13203",
      "site": "Case Farms, Canton, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 31,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13473",
      "site": "Case Farms, Canton, Case Farms, Farmerville, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman",
      "topic": "Deployed",
      "testing_status": "Yes"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 32,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13130",
      "site": "Case Farms, Canton, Case Farms, Farmerville, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 33,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13276",
      "site": "Case Farms, Canton, Case Farms, Farmerville, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed",
      "testing_status": "Yes"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 34,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13298",
      "site": "Case Farms, Canton, Case Farms, Farmerville, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed",
      "testing_status": "Yes"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 35,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13341",
      "site": "Case Farms, Canton, Case Farms, Farmerville, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed",
      "testing_status": "Yes"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 36,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13342",
      "site": "Case Farms, Canton, Case Farms, Farmerville, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed",
      "testing_status": "Yes"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 37,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13538",
      "site": "Case Farms, Canton, Case Farms, Farmerville, Case Farms, Goldsboro, Case Farms, Morganton, Case Farms, Troutman, Case Farms, Winesburg",
      "topic": "Deployed",
      "testing_status": "Yes"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 38,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "12827",
      "site": "Case Farms, Troutman",
      "topic": "Deployed"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 39,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "13569",
      "site": "Case Farms, Troutman",
      "topic": "Deployed",
      "testing_status": "Yes"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 40,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "RM-13498",
      "site": "Farmerville",
      "topic": "Recall Report Discrepancies",
      "notes": "Finish development changes. 3/27 \u2013 This piece of recall reporting has been deployed and displays results but requires a refresh to view updated results."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 41,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "RM-13644",
      "site": "Farmerville",
      "topic": "Recall report returns no results",
      "notes": "Finish development changes. Additional deployment required to ensure report returns correct results."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 42,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "RM-13653",
      "site": "Farmerville",
      "topic": "S9 login failures / container instability (requires restart)",
      "notes": "Restarting containers temporarily resolves issue. One incident linked to container log movement stopping the S9 container; possible DB blocking suspected. Issue recreated by opening multiple Confirm Screen tabs. Deployed 3/1. 3/16 \u2013 Confirm whether issue occurred after deployment. 3/27 \u2013 Deployed to Farmerville."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 43,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "RM-13678",
      "site": "Farmerville",
      "topic": "Plant messenger / Q-Listener not processing",
      "notes": "Currently requires periodic restart of Plant Messenger and Q Listener. Deployed 3/17 at 10:15 AM EST. Update 3/23 \u2013 Additional changes made; ticket moved to In Testing. Next: Complete testing and schedule deployment if additional fix required."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 44,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "RM-13270",
      "site": "\u2014",
      "topic": "S9 \u2013 Send Images to Printer",
      "notes": "Enhancement allows printing images from S9. Testing underway across multiple printer models. Next: Complete testing and schedule deployment."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Deployed",
    "source_row": 45,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "RM-13538 \n(Ticket 95294)",
      "site": "\u2014",
      "topic": "Q6 GiveAway Calculation Issue",
      "notes": "Q6 patch ready; S9 unaffected. Example data needed for validation. Deployed to Test servers 01/29/2026. Next: Deploy to Live."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Issue with Cancelled Orders",
      "site": "Farmerville",
      "rm_reference": "RM 13446",
      "status": "Complete",
      "context_details": "All locations reported issues with order lines being removed. Deployed to Farmerville.",
      "last_update": "46052",
      "target_eta": "\u2014",
      "notes": "Deployed to Farmerville. Verify issue at other locations.",
      "next_steps": "Monitor other locations"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "FG Receive-by-Date label print does nothing (no PrintQueue insert)",
      "site": "Farmerville",
      "rm_reference": "RM 13648",
      "status": "Complete",
      "context_details": "In FG Receive-by-Date, printer is selectable but Print does nothing and no PrintQueue record is created. Example: PO 3006336/3006335, Blox 0066100000076, Pallet 0660633771.",
      "last_update": "2026-03-11 00:00:00",
      "target_eta": "TBD",
      "notes": "Root cause identified: PrinterName inserted into PrintQueue instead of PrinterPath preventing jobs from reaching printer service. Nimbus hotfix deployed and tested on .24. Customer confirmed printer .109 working. WMS config mismatch also discovered during troubleshooting.",
      "next_steps": "Trace Nimbus action -> PrintQueue insert; verify label crossrefs; confirm PrinterService container healthy and processing jobs.\n\nUpdate: Root cause identified and hotfix deployed."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Speed of S9 Reports",
      "site": "\u2014",
      "status": "Complete",
      "context_details": "Kim reported S9 FG Production Report takes 1\u20134 minutes to generate.",
      "last_update": "2026-01-30 00:00:00",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "CFS to gather additional details and investigate"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Saved/Published reports failing due to InventoryMovement_PalletDetail view error",
      "site": "Farmerville",
      "rm_reference": "RM 13643",
      "status": "Complete",
      "context_details": "Reports based on Inventory Movement are failing due to a SQL conversion issue in InventoryMovement_PalletDetail (DozensPerContainer is numeric but ISNULL uses '' instead of 0)",
      "last_update": "2026-03-04 00:00:00",
      "target_eta": "TBD",
      "notes": "Inventory Movement report (fix in testing)\nCooked Raw (pending)",
      "next_steps": "Update view to use ISNULL(..., 0); test; deploy fix; confirm reports run from Saved and Published."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Updates to Existing S9 Reports",
      "site": "\u2014",
      "rm_reference": "RM 8928",
      "status": "Complete",
      "context_details": "Kim expressed difficulty drilling down to serials associated with pallets. Inventory Movement Report 8928.",
      "last_update": "2026-03-16 00:00:00",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Deployed to live servers on 3/1"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Farmerville ASN failed to transfer to Goldsboro",
      "site": "Goldsboro",
      "rm_reference": "RM 13633",
      "status": "Complete",
      "context_details": "ASNs are processing, but not with the correct product type and target system of FG.",
      "last_update": "2026-03-11 00:00:00",
      "notes": "Kim to update Customers in Q6",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Count Ups on Scales",
      "site": "Farmerville",
      "rm_reference": "RM 13571",
      "status": "Complete",
      "context_details": "\u2014",
      "last_update": "2026-03-11 00:00:00",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "TBD"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Add Multiple Emails Functionality (Shipping Docs)",
      "site": "\u2014",
      "rm_reference": "RM 13276",
      "status": "Complete",
      "context_details": "Enable multiple email addresses across Q6, S9, QMessenger, Plant Listener, and Confirm Screen for shipping documents.",
      "last_update": "2026-03-11 00:00:00",
      "target_eta": "2026-03-01 00:00:00",
      "notes": "Passed Testing (KH). Deploy to Test Servers. Included with Email update. Test Q6 connected to Test S9. Q6 Test Server IP: 192.168.50.53; S9: 192.168.60.6. Issue found by Kim while testing 01/30/2026.",
      "next_steps": "Deploy to Live server"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "BOL Update \u2013 Print Route # Instead of Load/BOL #",
      "site": "\u2014",
      "rm_reference": "RM 13192",
      "status": "Complete",
      "context_details": "Load Number should be replaced with RouteNum. Hardcoded text remains \u201cLoad Number,\u201d populated value should be RouteNum.",
      "last_update": "2026-02-27 00:00:00",
      "target_eta": "2026-03-11 00:00:00",
      "notes": "Deployed to Test servers 01/29/2026. Case Farms to verify before live deployment.",
      "next_steps": "Await verification; deploy to Live"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Unable to Update Existing Orders in S9 (Allocation Code Error)",
      "site": "\u2014",
      "rm_reference": "RM 13473",
      "status": "Complete",
      "context_details": "Error when updating existing orders due to allocation code issue. Patch available and in testing.",
      "last_update": "2026-02-27 00:00:00",
      "target_eta": "2026-03-11 00:00:00",
      "notes": "Passed Testing (KH). Deployed to Test servers 01/29/2027.",
      "next_steps": "Deploy to Live"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Device Connections Release",
      "site": "\u2014",
      "rm_reference": "RM 13503",
      "status": "Complete",
      "context_details": "Device connections fail to properly release after inactivity.",
      "last_update": "2026-02-27 00:00:00",
      "target_eta": "2026-03-11 00:00:00",
      "next_steps": "Deploy to Live server"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "S9 Stalling / Invalid Shift Error",
      "site": "Farmerville",
      "rm_reference": "RM-13590",
      "status": "Complete",
      "context_details": "\u201cInvalid Shift\u201d errors and >5 min load times. Serial Audit search causes GUI hang. Restart only temporarily resolves.",
      "last_update": "\u2014",
      "target_eta": "ASAP",
      "notes": "System stability risk.",
      "next_steps": "Review logs, analyze query performance and container resources, implement root fix."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Orders not transferring to Goldsboro after deployment (messengers not started)",
      "site": "Goldsboro",
      "rm_reference": "TBD",
      "status": "Complete",
      "context_details": "Order 1600161095 did not transfer to Goldsboro after deployment (no RXresponse entry). Messengers failed to start; once started, the backlog cleared and the order transferred.",
      "last_update": "2026-03-04 00:00:00",
      "target_eta": "\u2014",
      "notes": "NEW \u2013 Identified during Sunday deployment validation.",
      "next_steps": "Add a deployment checklist item to verify that all messengers/listeners are running and that the message backlog is clearing."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "BOL not printing customer/address info (ShipTo fields blank)",
      "site": "Farmerville",
      "rm_reference": "RM 13637",
      "status": "Complete",
      "context_details": "BOL is missing ShipTo customer/address. ShipTo fields in OrderHeader appear blank; possible regression noted (S9 Git Issue 1318 mentioned).",
      "last_update": "2026-03-11 00:00:00",
      "target_eta": "Retest on .24",
      "notes": "NEW \u2013 Reported post-deployment.",
      "next_steps": "Confirm source of ShipTo values; correct mapping/regression; retest and validate output with the plant."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 16,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "PlantListener unhealthy / failed messages and batch numbers reset after reqshipdate changes",
      "site": "Farmerville",
      "rm_reference": "RM 13645",
      "status": "Complete",
      "context_details": "PlantListener is unhealthy and Q shows many failed messages. Changing reqshipdate appears to remove OrderHeader and may be resetting interface batch/transaction sequencing.",
      "last_update": "2026-03-11 00:00:00",
      "target_eta": "TBD",
      "notes": "NEW \u2013 Observed after deployment weekend.",
      "next_steps": "Prevent BatchNumber reset; correct handling when reqshipdate changes; clear failed messages and validate interface."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 17,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Truck Diagram Link on Shipping Dashboard",
      "site": "\u2014",
      "rm_reference": "PO #664341 (RM 12984)",
      "status": "Complete",
      "context_details": "Developed for S9; truck diagram visible per Case Farms.",
      "last_update": "2025-09-25 00:00:00",
      "target_eta": "TBD",
      "notes": "WJ to confirm PO as it relates to billing.",
      "next_steps": "Confirm billing alignment"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 18,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "SLC Count-Up Not Clearing After Sync",
      "site": "Farmerville",
      "rm_reference": "RM-13571",
      "status": "Waiting on Info",
      "context_details": "Scale 53 (v6.2.2.5.0) retained ~1358 count-up despite serials in DB. Crossref export/import completed. ActiveMQ showed no backlog. Scale had been offline; restart only reduced count slightly. Likely missed serial acknowledgements.",
      "last_update": "~02/12/2026",
      "target_eta": "TBD",
      "notes": "Messaging/acknowledgment sync issue.",
      "next_steps": "Review SLC DB, validate ACK handling, confirm message replay logic, determine impact of offline period."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 19,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Multiple Batches for Same Confirmed Order",
      "site": "\u2014",
      "rm_reference": "RM 13496",
      "status": "Complete",
      "context_details": "Multiple batches generated for same confirmed order; HD and Dev reviewing behavior.",
      "last_update": "2026-03-11 00:00:00",
      "target_eta": "2026-03-01 00:00:00",
      "notes": "Estimated deployment week of Feb 2nd.",
      "next_steps": "Complete testing; deploy"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 20,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "NimbusPT functions list incorrect (MenuItem table has only test record)",
      "site": "Farmerville",
      "rm_reference": "Issue 844",
      "status": "Complete",
      "context_details": "PT function list (from Inven.dbo.MenuItem where SystemName='nimbuspt') only has a test record in Farmerville. Remove the test row and insert the correct PT function records.",
      "last_update": "2026-03-04 00:00:00",
      "target_eta": "After .24 testing",
      "notes": "Needs data correction + permissions coordination.",
      "next_steps": "Remove test record; insert correct MenuItem rows; test and deploy alongside group permissions update."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 21,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Saved Shipping Documents \u2013 Search by PO",
      "site": "\u2014",
      "rm_reference": "RM 13298",
      "status": "Complete",
      "context_details": "Add field to search Saved Shipping Documents by PO.",
      "last_update": "2026-03-11 00:00:00",
      "target_eta": "2026-03-01 00:00:00",
      "notes": "Passed Testing (KH). Deployed to Test servers 01/29/2026",
      "next_steps": "Deploy to Live"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 22,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "WMS configuration mismatch discovered during troubleshooting",
      "site": "Farmerville",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "WMS Enable set to Yes but no WMS Endpoint configured which caused WMS errors unrelated to printer issue.",
      "last_update": "2026-03-06 00:00:00",
      "target_eta": "Monday config change",
      "notes": "Identified during Nimbus troubleshooting.",
      "next_steps": "Set WMS Enable to No unless endpoint defined."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 23,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "S9 Performance / Speed",
      "site": "\u2014",
      "status": "Complete",
      "context_details": "Memory-related performance issues when multiple dashboards/reports run. Dev updates on 12/03/2025; stable since.",
      "last_update": "45995",
      "notes": "\u2014",
      "next_steps": "Continue monitoring"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 24,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "Need Label Stock for Zones (Winesburg & Morganton)",
      "status": "Complete",
      "context_details": "\u2014",
      "last_update": "\u2014",
      "notes": "CFS Chase brought back boxes and label stock from Winesburg",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Complete",
    "source_row": 25,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "VRT scanners - How the scanner works when offline.",
      "site": "\u2014",
      "rm_reference": "\u2014",
      "status": "Complete",
      "context_details": "Question if it operates similarly to an SLC, building up data and then transmitting it once the connection is re-established",
      "last_update": "2026-03-12 00:00:00",
      "target_eta": "\u2014",
      "notes": "Confirmed on 3/13 status call that scanners do not work like the SLC when offline",
      "next_steps": "\u2014"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "rm_reference": "RM 13590"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Count Ups on Scales",
      "site": "Farmerville",
      "rm_reference": "RM 13571"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Issue with Cancelled Orders",
      "rm_reference": "RM 13446",
      "status": "Deployed to Farmerville",
      "context_details": "All locations have reported issues with order lines being removed.",
      "last_update": "2026-01-30 00:00:00",
      "next_steps": "Deployed to Farmerville. Verify issue at other locations"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Farmerville QMessenger Queue Backlog",
      "status": "Complete",
      "context_details": "Farmerville messages are processing but backlog exceeds ~65,000 records. Help Desk monitoring; Development investigating script behavior and root cause.",
      "last_update": "2026-01-05 00:00:00",
      "target_eta": "2026-01-05 00:00:00",
      "next_steps": "Identify root cause; confirm remediation plan and ETA."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Add Multiple Emails Functionality (Shipping Docs)",
      "rm_reference": "RM 13276",
      "status": "Deployed to Test",
      "context_details": "Enable multiple email addresses across Q6, S9, QMessenger, Plant Listener, and Confirm Screen for shipping documents.",
      "last_update": "2026-01-29 00:00:00",
      "target_eta": "2026-01-16 00:00:00",
      "notes": "Passed Testing (KH)",
      "next_steps": "Deploy to Test Servers. Included with Email update. ( Test Q6 connected to Test S9) Q6 Test Server IP:  192.168.50.53; S9 : 192.168.60.6. Issue found by Kim while testing 1/30/26."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "S9 \u2013 Send Images to Printer",
      "rm_reference": "RM 13270",
      "status": "In Testing",
      "context_details": "Enhancement to allow image printing from S9; testing across multiple printer models.",
      "last_update": "week of 2/9/26",
      "target_eta": "TBD",
      "next_steps": "Estimated deployment week of Feb 2nd."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "BOL Update \u2013 Print Route # Instead of Load/BOL #",
      "rm_reference": "RM 13192",
      "status": "Deployed to Test",
      "context_details": "Load Number should be replaced with the RouteNum. The hardcoded text should still read 'Load Number', but the populated value should be the RouteNum.",
      "last_update": "2026-01-05 00:00:00",
      "target_eta": "TBD",
      "next_steps": "Deployed to Test servers 1/29/26. Case Farms to verify before update is deployed to live."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Unable to Update Existing Orders in S9 (Allocation Code Error)",
      "rm_reference": "13473",
      "status": "Deployed to Test",
      "context_details": "Error occurs when updating existing orders due to allocation code issue. Patch available and in testing.",
      "last_update": "2026-01-29 00:00:00",
      "target_eta": "TBD",
      "notes": "Passed Testing (KH)",
      "next_steps": "Deployed to Test servers 1/29/27"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Process Tracking (PT) \u2013 Farmerville (Receiving & Issuing)",
      "status": "Needs Alignment",
      "context_details": "Case Farms requested full PT deployment in S9 at Farmerville. Scope and timeline not yet aligned; marination batching also requested. | CF speculated dates 10/26\u201310/31 (*unclear what these represent). Currently Receiving in Ing and Pkg. No Issuing",
      "last_update": "2025-09-25 00:00:00",
      "target_eta": "TBD",
      "next_steps": "Align scope; provide PT timeline and milestones. | Provide Case Farms estimated dates for PT development. Need a date for Batching CFS to provide an update on remaining functions. Farmerville is currently receiving and Issue."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "S9 Upgrade \u2013 Winesburg First",
      "rm_reference": "PO Provided",
      "status": "Planned",
      "context_details": "PO received. Winesburg first upgrade; Canton last. Est. 1 week server setup + 1 week testing. Shipping docs TBD.",
      "last_update": "2025-09-25 00:00:00",
      "target_eta": "TBD",
      "next_steps": "Confirm shipping docs; finalize upgrade schedule. | Determine shipping documents for Winesburg."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "SCC18 Pallet Labels (EDI Customers)",
      "status": "Partially Deployed",
      "context_details": "Dynamic SCC18 pallet label format finalized. Deployed to Farmerville; unsure if deployed to other plants. Uses ship-to customer data.",
      "last_update": "2025-09-25 00:00:00",
      "target_eta": "TBD",
      "next_steps": "Plan for deploying to other locations."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Multiple Batches for Same Confirmed Order",
      "rm_reference": "13496",
      "status": "In Testing",
      "context_details": "Multiple batches generated for same confirmed order; HD and Dev reviewing behavior.",
      "last_update": "2026-01-05 00:00:00",
      "target_eta": "TBD",
      "next_steps": "Estimated deployment week of Feb 2nd."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Goldsboro VRT PC Services Stopping",
      "rm_reference": "RM 13008",
      "status": "Pending Coordination",
      "context_details": "PM2 processes stop; serials not moving through VRT. New VM built by CF; downtime needed to cut over.",
      "last_update": "2025-09-25 00:00:00",
      "target_eta": "TBD",
      "next_steps": "Configure VM; coordinate cutover window."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Q6 GiveAway Calculation Issue",
      "rm_reference": "Ticket 95294",
      "status": "Deployed to Test",
      "context_details": "Incorrect Total/Average GiveAway on Q6 Production report. Q6 patch ready; S9 unaffected; example needed.",
      "last_update": "2025-01-29 00:00:00",
      "target_eta": "TBD",
      "next_steps": "Deployed to Test servers 1/29/26"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 16,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Truck Diagram Link on Shipping Dashboard",
      "rm_reference": "PO #664341 (RM 12984",
      "status": "Complete",
      "context_details": "Developed for S9; truck diagram visible per Case Farms.",
      "last_update": "2025-09-25 00:00:00",
      "target_eta": "TBD",
      "next_steps": "WJ to confirm PO as it relates to billing."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 17,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "Saved Shipping Documents \u2013 Search by PO",
      "rm_reference": "RM 13298",
      "status": "Deployed to Test",
      "context_details": "Add field to search Saved Shipping Documents by PO.",
      "last_update": "2026-01-29 00:00:00",
      "target_eta": "TBD",
      "notes": "Passed Testing (KH)",
      "next_steps": "Deployed to Test servers 1/29/26"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 18,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Medium",
      "topic": "SOP \u2013 Offsite Blast Freezer (Farmerville) Ship & Return",
      "status": "In Spec",
      "context_details": "Need SOP/process to ship product to offsite blast freezer and return to plant.",
      "last_update": "2025-09-25 00:00:00",
      "target_eta": "TBD",
      "next_steps": "CFS to call Kim on 2/2/26 to discuss"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 19,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "QA Hold \u2013 Add Note Field",
      "status": "Backlog",
      "context_details": "Request to add note field when placing product on QA hold. New development required; low priority.",
      "last_update": "2025-09-25 00:00:00",
      "next_steps": "Spec and quote if priority increases."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 20,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "BloxLog Split Issue",
      "rm_reference": "RM 12215",
      "status": "In Development (Low)",
      "context_details": "Split shows Split-In without Split-Out. Plant not using feature; deprioritized.",
      "last_update": "2025-09-25 00:00:00",
      "next_steps": "Check status when bandwidth allows."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 21,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "Automatically Apply Hold Status to Product Code",
      "status": "Concept Only",
      "context_details": "Prevent test product codes from shipping. Options discussed; not spec\u2019d.",
      "last_update": "2025-09-25 00:00:00",
      "next_steps": "No action unless prioritized."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 22,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "Print Userbars from PC vs SLC",
      "status": "Needs Spec",
      "context_details": "Request to print userbars from PC; CF does not batch print today.",
      "last_update": "2025-09-25 00:00:00",
      "next_steps": "Discuss and spec if needed."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 23,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "Rebound Project",
      "status": "On Hold",
      "context_details": "Removed from CF consideration due to ROI concerns; may revisit post-S9.",
      "last_update": "2025-09-25 00:00:00",
      "next_steps": "Case Farms discussed holding off until upgrade to S9."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 24,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "S9 Performance / Speed",
      "status": "Complete",
      "context_details": "Memory-related performance issues when multiple dashboards/reports run. Dev updates on 12/3; stable since.",
      "last_update": "2025-12-04 00:00:00",
      "next_steps": "Continue monitoring."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 25,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "Low",
      "topic": "ACS & Reject Project \u2013 Goldsboro",
      "status": "Quote Sent",
      "context_details": "Quote sent; deprioritized.",
      "last_update": "2025-09-25 00:00:00",
      "next_steps": "Kim to follow up with Nicole and Kevin on status."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 26,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Device Connections Release",
      "rm_reference": "RM 13503",
      "status": "Deployed to Test",
      "context_details": "Device connections fail to properly release after a period of inactivity",
      "last_update": "2026-01-29 00:00:00",
      "next_steps": "Deploy to Live server."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 27,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Speed of S9 Reports",
      "status": "Open",
      "context_details": "Kim reported issues with the time it takes to generate the S9 FG Production Rpt. Times between 1 to 4 minutes.",
      "last_update": "2026-01-30 00:00:00",
      "next_steps": "CFS to gather additional details and investigate."
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 28,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "priority": "High",
      "topic": "Updates to existing S9 reports.",
      "rm_reference": "RM 8928",
      "status": "Open",
      "context_details": "Kim expressed difficulty drilling down to serials associated with pallets.",
      "last_update": "2026-01-30 00:00:00",
      "next_steps": "CFS is exploring updates. | Inventory Movement Report 8928"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 29,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "topic": "ACS Wineburg"
    }
  },
  {
    "source_file": "Case_Farms_-_Open_Items.xlsx",
    "source_sheet": "Archive",
    "source_row": 30,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Case Farms",
      "topic": "Node Core Failure When Receiving in PT Product in Receive By Date - Farmerville",
      "rm_reference": "RM - 13572",
      "status": "Open",
      "next_steps": "deployment will require 1 1/2 of downtime"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Highest",
      "topic": "Recall Updates for CC.",
      "site": "Consolidated Catfish",
      "rm_reference": "?",
      "context_details": "Get with DK"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Highest",
      "topic": "Goal Completed But Shows Lower Count",
      "site": "Consolidated Catfish",
      "rm_reference": "13647",
      "status": "Testing Complete",
      "context_details": "Red reported they fully produced 80 cases towards a goal for order 372693 to complete it on scale 1 but the goal was still available to produce towards on other scales",
      "last_update": "2026-03-20 00:00:00",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "S9 \u2013 Not All Orders Showing in Work Order Planner",
      "site": "Consolidated Catfish",
      "rm_reference": "13565",
      "status": "Testing Complete",
      "context_details": "Not all orders appear in Work Order Planner.",
      "target_eta": "TBD",
      "notes": "Projects tested 3/3 Passed",
      "next_steps": "Deploy"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Device Connections Not Clearing",
      "site": "Consolidated Catfish",
      "rm_reference": "13562",
      "status": "Testing Complete",
      "context_details": "Device connections not clearing properly.",
      "target_eta": "Deployment Pending",
      "notes": "Testing complete.",
      "next_steps": "Deploy"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Pick List Showing Duplicate / Incorrect Information",
      "site": "Consolidated Catfish",
      "rm_reference": "13481",
      "status": "Testing Complete",
      "context_details": "Pick list report displays duplicate and incorrect data.",
      "last_update": "2026-02-18 00:00:00",
      "target_eta": "TBD",
      "notes": "Projects tested 3/3 Passed",
      "next_steps": "Deploy"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Consolidated Catfish \u2013 S9 Random Log Outs",
      "site": "Consolidated Catfish",
      "rm_reference": "13492",
      "status": "Moved to Programming",
      "context_details": "Users randomly logged out of S9.",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Nimbus Stalls Causing \u201cInitializing\u201d",
      "site": "Consolidated Catfish",
      "rm_reference": "13480",
      "status": "Moved to Programming",
      "context_details": "Nimbus stalls causing initialization screen to hang.",
      "last_update": "2026-03-19 00:00:00",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "Testing\n-Update as of 3/19: Help Desk stated issue identified in RM happened again today"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "S9 \u2013 Display \u201cMixed\u201d for Mixed Item Code Pallets",
      "site": "Consolidated Catfish",
      "rm_reference": "13467",
      "status": "Testing Complete",
      "context_details": "Mixed item code pallets should display \u201cMixed.\u201d",
      "notes": "Projects tested 2/25",
      "next_steps": "Deploy"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "S9 Nimbus \u2013 Reassign Serial Creation",
      "site": "Consolidated Catfish",
      "rm_reference": "13436",
      "status": "Testing Complete",
      "context_details": "Serial creation during reassign needs validation.",
      "next_steps": "Deploy"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "RF Credit Issue - Serials display 0 lbs",
      "site": "Consolidated Catfish",
      "rm_reference": "13651",
      "status": "Moved to Programming",
      "context_details": "Red reported they receive an error when attempting to credit pallet 2660628973. HD found that the pallet was already credited back but noticed that the weight was set to 0. Note: Question regarding how to back up transactions. Adjust function??  3/23/26",
      "last_update": "2026-03-09 00:00:00",
      "notes": "Reach out to Red about if it was a single case he was trying to credit back. (Partial tub)",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Tally Scan Issues \u2013 Fillet Cooler Right side #4 and Left Side #3 and #5",
      "site": "Consolidated Catfish",
      "status": "Shipped",
      "context_details": "Scanner connectivity issues at specific cooler positions.\n\n3/19/26 Filet Cooler scanner #5 is currently working during (Testing). CFS to send 4 enclosures for replacement scanners. \n3/27/25 - 3 Replacement scanners and 4 cases shipped",
      "last_update": "2026-03-10 00:00:00",
      "target_eta": "TBD",
      "notes": "Tony sent back affected cameras. Tracking 1ZK6B1430142934646",
      "next_steps": "CFS to send protective covers for replacement scanners. Waiting on warranty response from Cognex"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Medium",
      "topic": "BOL Update",
      "site": "Consolidated Catfish",
      "rm_reference": "12721",
      "status": "In-Spec",
      "context_details": "Add the warehouse number (e.g., \"WHSE 26\") next to the company name in the heading,\nAdd a line for \"truck run\" in the top right section to include the load number (a three-digit number with a six-digit date)\nIncrease the size of Signatures and Initials as they appear on the BOL from the signature pad. \n3/19/26 - BOL to include orderlines with 0 qty picked",
      "last_update": "2026-03-17 00:00:00",
      "next_steps": "Quote"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Medium",
      "topic": "Partial Tub Override \u2013 Barcode Correct but Putin Incorrect",
      "site": "Consolidated Catfish",
      "rm_reference": "13507",
      "status": "Waiting on Customer",
      "context_details": "Supervisor override creates correct barcode but putin does not reflect correctly.",
      "target_eta": "TBD",
      "notes": "Projects tested and could not recreate. Red stated that he would call CFS next time the issue arises."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Medium",
      "topic": "Case Mode Not Showing After Inactivity",
      "site": "Consolidated Catfish",
      "rm_reference": "13559",
      "status": "Moved to Programming",
      "context_details": "Case mode checkbox disappears after extended inactivity.",
      "target_eta": "TBD",
      "notes": "Projects recreated on .86 and sent to programming",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 16,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Medium",
      "topic": "Long load times for PO",
      "site": "Consolidated Catfish",
      "rm_reference": "13580",
      "status": "Testing Complete",
      "context_details": "CC called and stated they have noticed the PO/Manifest report increasingly takes longer to load then when they initially started.",
      "last_update": "2026-02-11 00:00:00",
      "target_eta": "TBD",
      "next_steps": "Deployment"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 17,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Medium",
      "topic": "Pallet State is Broken When Two Different Status Codes are found on Pallet",
      "site": "Consolidated Catfish",
      "rm_reference": "13598",
      "status": "Waiting on Info",
      "context_details": "\u2014",
      "last_update": "2026-02-18 00:00:00",
      "target_eta": "\u2014",
      "notes": "\u2014",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 18,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Medium",
      "topic": "FG Production and FG Scanned Production reports take a long time to load",
      "site": "Consolidated Catfish",
      "rm_reference": "13620",
      "status": "Moved to Programming",
      "context_details": "Lee stated that the Production and Scanned Production reports are taking +50 seconds to load",
      "last_update": "TBD",
      "target_eta": "TBD",
      "next_steps": "Create RM and assign to dev if issue is confirmed"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 19,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Medium",
      "topic": "S9 - Pick List Default Filters",
      "site": "Consolidated Catfish",
      "rm_reference": "13625",
      "status": "Testing Active",
      "context_details": "Each time that CC pulls a pick list report, they have to set the filters that they want to include on the pick list initially.",
      "last_update": "2026-02-25 00:00:00",
      "target_eta": "TBD",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 20,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Medium",
      "topic": "Order LPQ",
      "site": "Consolidated Catfish",
      "rm_reference": "13668",
      "status": "Moved to Programming",
      "context_details": "William called in reporting for order 0000372675 the load count was off by 7 compared to the pick count",
      "last_update": "2026-03-11 00:00:00",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 21,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Low",
      "topic": "S9 - Add Batch Screen Bug",
      "site": "Consolidated Catfish",
      "rm_reference": "13630",
      "status": "Moved to Programming",
      "context_details": "When selecting the Add button to add a batch in the Batch Scheduler, the table loads up with the alignment off and the validation error messages already triggered.",
      "last_update": "2026-02-26 00:00:00",
      "target_eta": "TBD",
      "next_steps": "Testing"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 22,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Low",
      "topic": "Customer Has Different Box Tares for Same Product Code",
      "site": "Consolidated Catfish",
      "status": "Waiting on Customer",
      "context_details": "No current way to change tares for same product code.",
      "last_update": "TBD",
      "target_eta": "TBD",
      "notes": "\u2014",
      "next_steps": "CC Tabled discussion for now"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 23,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "ASN requirements for Costco",
      "site": "Consolidated Catfish",
      "status": "Waiting on Customer"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Open",
    "source_row": 24,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Low",
      "topic": "Question regarding preventing mixed dates in Palletize",
      "site": "Consolidated Catfish",
      "context_details": "PT will allow mixed with config. SSS will not. Work SOP angle, possible spec to include mixed pallets with SSS."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Scale 16 Black Screen",
      "site": "Consolidated Catfish",
      "rm_reference": "TBD",
      "status": "Complete",
      "context_details": "Scale 16 displayed black screen.",
      "last_update": "11/14/TBD",
      "target_eta": "\u2014",
      "notes": "No issues since Nov 14.",
      "next_steps": "Monitor"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "\u201cPallet Depleted\u201d Error When Crediting Pallet",
      "site": "Consolidated Catfish",
      "rm_reference": "TBD",
      "status": "Complete",
      "context_details": "Users scanned incorrect pallets during put-in.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "User scanning error identified."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Recabling of Tally Scan Lines",
      "site": "Consolidated Catfish",
      "rm_reference": "TBD",
      "status": "Complete",
      "context_details": "Recabling performed.",
      "last_update": "12/13\u201312/14",
      "target_eta": "\u2014",
      "notes": "Install completed."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "RF Connections Running Out \u2013 Heartbeat Issue",
      "site": "Consolidated Catfish",
      "rm_reference": "TBD",
      "status": "Complete",
      "context_details": "Heartbeat inactivity issue.",
      "last_update": "2025-12-04 00:00:00",
      "target_eta": "\u2014",
      "notes": "Raised Nov 5. Deployed 12/04/2025."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Checks to Prevent >10,000 Serials Per Scale Per Day",
      "site": "Consolidated Catfish",
      "rm_reference": "Git-712",
      "status": "Complete",
      "context_details": "Limit implemented.",
      "last_update": "2025-12-04 00:00:00",
      "target_eta": "\u2014",
      "notes": "Deployed 12/04/2025."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Enforce Directed Pick Default Not Auto-Populating",
      "site": "Consolidated Catfish",
      "rm_reference": "Git-189",
      "status": "Complete",
      "context_details": "Configuration adjusted.",
      "last_update": "2025-12-04 00:00:00",
      "target_eta": "\u2014",
      "notes": "Deployed 12/04/2025."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Sell-By Date Not Retrieved from Order Detail",
      "site": "Consolidated Catfish",
      "rm_reference": "12626 / Git-809",
      "status": "Complete",
      "context_details": "Sell-by date retrieval corrected.",
      "last_update": "2025-12-04 00:00:00",
      "target_eta": "\u2014",
      "notes": "Testing complete."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Pick Sheet Showing Incorrect Dates",
      "site": "Consolidated Catfish",
      "rm_reference": "Git-1270",
      "status": "Complete",
      "context_details": "Date display issue corrected.",
      "last_update": "2025-12-04 00:00:00",
      "target_eta": "\u2014",
      "notes": "Raised Nov 19."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Limit Serials Per Request to 2000",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Limit implemented.",
      "last_update": "2025-12-04 00:00:00",
      "target_eta": "\u2014",
      "notes": "Deployed."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Work Order Planner Filter Issue",
      "site": "Consolidated Catfish",
      "rm_reference": "Git-1254",
      "status": "Complete",
      "context_details": "Filter corrected.",
      "last_update": "2025-12-04 00:00:00",
      "target_eta": "\u2014",
      "notes": "Deployed."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Reassign Fails to Print Customer Labels",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Printing validated.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "Tested."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Tolerance Adjustments Not Reflected at Scale",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Scale sync validated.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "Tested."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Work Orders Showing \u201cUnscheduled\u201d",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Display corrected.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "Tested."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Description Showing Incorrectly",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Description corrected.",
      "last_update": "10/30/TBD",
      "target_eta": "\u2014",
      "notes": "Deployed and tested."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 16,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Order 369257 Not Going into S9",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Order issue resolved.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 17,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Restore Deleted Freezer Inventory Data",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Data restored.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 18,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Printers Intermittently Stopping",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Issue resolved.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 19,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Combine Serialized Pallets Spec",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "enforcecasescaninpalletize config set to \u201cNo\u201d.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "Config updated and tested."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 20,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Truck Diagram Pulling Item Code",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Verified pulling Item Code.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "Confirmed behavior."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 21,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Credit Back WIP Tub Shows \u201cDepleted\u201d",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "User scanned original pallet instead of credited pallet.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "User error identified."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 22,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Spare RJ45 to DB9 Adapters Sent",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Replacement shipped.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "RE shipped."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 23,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Load Report Stop Number Population",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "StopSeq already in DB; setup email sent.",
      "last_update": "TBD",
      "target_eta": "\u2014",
      "notes": "CC advised of setup."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 24,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Some Order Files Rejected",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "Line item quantity showed .00000 instead of 0.",
      "last_update": "02/11/TBD",
      "target_eta": "\u2014",
      "notes": "Marked resolved per Tony email."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 25,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "Order File Not Processed Product Code Not Found",
      "site": "Consolidated Catfish",
      "rm_reference": "13583",
      "status": "Complete",
      "context_details": "CC sent an order file that wasn't processed. The interface cited an error that the product code 16651 was not found. However checking Q6 and S9 HD can see that the prodcode and item code matched, however the productname was different. It seems like QERP is referencing the wrong field when orders are being sent down.",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 26,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "S9 \u2013 Load Assignment Date Search Returning Wrong Data",
      "site": "Consolidated Catfish",
      "rm_reference": "13487",
      "status": "Complete",
      "context_details": "Searching by load date returns incorrect day\u2019s data.",
      "last_update": "2026-02-17 00:00:00",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 27,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "S9 \u2013 Snake Pattern Load Sequence",
      "site": "Consolidated Catfish",
      "rm_reference": "13468",
      "status": "Complete",
      "context_details": "Load sequence using snake pattern requires validation.",
      "last_update": "2026-02-18 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 28,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "S9 \u2013 Display \u201cMixed\u201d for Mixed Item Code Pallets",
      "site": "Consolidated Catfish",
      "rm_reference": "13467",
      "status": "Complete",
      "context_details": "Mixed item code pallets should display \u201cMixed.\u201d",
      "last_update": "2026-02-18 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 29,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "BOL Order Quantity Incorrect",
      "site": "Consolidated Catfish",
      "rm_reference": "13453",
      "status": "Complete",
      "context_details": "BOL showing incorrect order quantities.",
      "last_update": "2026-02-18 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 30,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "S9 Nimbus \u2013 Reassign Serial Creation",
      "site": "Consolidated Catfish",
      "rm_reference": "13436",
      "status": "Complete",
      "context_details": "Serial creation during reassign needs validation.",
      "last_update": "2026-02-18 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 31,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "S9 \u2013 Add Item Code to Pick List Report",
      "site": "Consolidated Catfish",
      "rm_reference": "13402",
      "status": "Complete",
      "context_details": "Pick list report enhancement to include Item Code.",
      "last_update": "2026-02-18 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 32,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "S9 \u2013 BOL Update",
      "site": "Consolidated Catfish",
      "rm_reference": "12721",
      "status": "Complete",
      "context_details": "BOL update for Consolidated Catfish.",
      "last_update": "2026-02-18 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 33,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Highest",
      "topic": "Pallet Created in Simple Scan Failed to Create Serials in Inventory",
      "site": "Consolidated Catfish",
      "rm_reference": "13509",
      "status": "Complete",
      "context_details": "Pallet created in Simple Scan did not generate serials in inventory.",
      "last_update": "2026-02-25 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 34,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Highest",
      "topic": "SSS Failed to Update Pallet Records After Failed Scan",
      "site": "Consolidated Catfish",
      "rm_reference": "13582",
      "status": "Complete",
      "last_update": "2026-02-25 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 35,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Highest",
      "topic": "Pallets failed validation and did not get created in Inven",
      "site": "Consolidated Catfish",
      "status": "Complete",
      "context_details": "One of the serials had an invalid Julian Date and Nimbus blocked the Serial from being created. The Serial Number was 261322100162. The Julian Date 2210 was outside the allowed ScanJulianWgtChkMin config value of 365 set in Inven. To address this, DF updated the SSS to do the same Julian Date Checks. DF set the default values for the Configs to match how it is set at CC.",
      "last_update": "2026-02-27 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 36,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "High",
      "topic": "SLC Produced More Than Goal Target Without Tolerance",
      "site": "Consolidated Catfish",
      "rm_reference": "13510",
      "status": "Complete",
      "context_details": "Production exceeded goal without tolerance applied.",
      "last_update": "2026-03-03 00:00:00",
      "notes": "\u2014"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 37,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Highest",
      "topic": "Serial Julian Date Validation",
      "site": "Consolidated Catfish",
      "rm_reference": "13582",
      "status": "Complete",
      "last_update": "2026-03-05 00:00:00",
      "notes": "Deployed 3/5",
      "next_steps": "Deploy"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Complete",
    "source_row": 38,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "priority": "Medium",
      "topic": "Cleardown Not Archiving Serials",
      "site": "Consolidated Catfish",
      "rm_reference": "13619",
      "status": "Complete"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Deployments",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "rm_reference": "RM13487",
      "category": "Bug",
      "topic": "Load Assignment date search returning wrong day",
      "status": "Deployed",
      "priority": "Normal",
      "start_date": "2026-01-07 00:00:00",
      "deployed_date": "2026-02-17 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Deployments",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "rm_reference": "RM13453",
      "category": "Bug",
      "topic": "BOL order quantity incorrect",
      "status": "Deployed",
      "priority": "Normal",
      "start_date": "2025-12-22 00:00:00",
      "deployed_date": "2026-02-18 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Deployments",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "rm_reference": "RM13402",
      "category": "Enhancement",
      "topic": "Add Item Code to Pick List Report",
      "status": "Deployed",
      "priority": "Normal",
      "start_date": "2025-12-02 00:00:00",
      "deployed_date": "2026-02-19 00:00:00"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Deployments",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "rm_reference": "RM13468",
      "category": "Enhancement",
      "topic": "S9 \u2013 Snake Pattern Load Sequence",
      "status": "Deployed",
      "priority": "Normal",
      "start_date": "\u2013",
      "deployed_date": "\u2013"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Deployments",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "rm_reference": "RM13467",
      "category": "Enhancement",
      "topic": "S9 \u2013 Display \u201cMixed\u201d for Mixed Item Code Pallets",
      "status": "Deployed",
      "priority": "Normal",
      "start_date": "\u2013",
      "deployed_date": "\u2013"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Deployments",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "rm_reference": "RM13436",
      "category": "Enhancement",
      "topic": "S9 Nimbus \u2013 Reassign Serial Creation",
      "status": "Deployed",
      "priority": "Normal",
      "start_date": "\u2013",
      "deployed_date": "\u2013"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Deployments",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "rm_reference": "RM12721",
      "category": "Enhancement",
      "topic": "S9 \u2013 BOL Update",
      "status": "Deployed",
      "priority": "Normal",
      "start_date": "\u2013",
      "deployed_date": "\u2013"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 2,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Scale 16 showed a black screen.",
      "status": "Complete",
      "owner": "\u2014",
      "rm_reference": "TBD",
      "notes": "No issues since Nov 14th."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 3,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "\u201cPallet Depleted\u201d error when crediting pallet.",
      "status": "Complete",
      "owner": "\u2014",
      "rm_reference": "TBD",
      "notes": "Found to be an issue with users accidently scanning wrong pallets to putin"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 4,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Recabling of Tally Scan lines.",
      "status": "Complete",
      "owner": "\u2014",
      "notes": "Install scheduled 12/13-12/14"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 5,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "RF connections running out. Heartbeat inactivity issue.",
      "status": "Complete",
      "owner": "\u2014",
      "notes": "Raised Nov 5th. Deployed 12/4/25"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 6,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Checks to prevent >10,000 serials per day per scale.",
      "status": "Complete",
      "owner": "\u2014",
      "rm_reference": "Git-712",
      "notes": "Deployed 12/4/25"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 7,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "\u201cEnforce Directed Pick\u201d default not auto-populating",
      "status": "Complete",
      "owner": "\u2014",
      "rm_reference": "Git-189",
      "notes": "Ensure \"enforce directed pick default mode\" is set to mode | Deployed 12/4/25"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 8,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Sell-by date not retrieved from Order Detail table",
      "status": "Complete",
      "owner": "\u2014",
      "rm_reference": "12626",
      "notes": "Testing Complete | Git-809 | Deployed 12/4/25"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 9,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Pick Sheet showing a different Production, Palletize and Kill-date than intended.",
      "status": "Complete",
      "owner": "\u2014",
      "rm_reference": "Git-1270",
      "notes": "Raised Nov 19th. | Deployed 12/4/25"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 10,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Limit serials per request to 2000.",
      "status": "Complete",
      "owner": "\u2014",
      "notes": "Deployed 12/4/25"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 11,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Issue with Work Order Planner Filter.",
      "status": "Complete",
      "owner": "\u2014",
      "rm_reference": "Git-1254",
      "notes": "Deployed 12/4"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 12,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Reassign fails to print customer product labels.",
      "status": "Complete",
      "owner": "\u2014",
      "notes": "Tested"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 13,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Tolerance adjustments appear in reports but not reflected at the scale.",
      "status": "Complete",
      "owner": "\u2014",
      "notes": "Tested"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 14,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Work orders tied to batches showing as \u201cunscheduled\u201d (bulk side).",
      "status": "Complete",
      "owner": "\u2014",
      "notes": "Tested"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 15,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Description showing incorrectly",
      "status": "Complete",
      "owner": "\u2014",
      "notes": "Deployed 10/30. Tested."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 16,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Order 369257 not going into S9",
      "status": "Complete",
      "owner": "\u2014"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 17,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Restore deleted freezer inventory data",
      "status": "Complete",
      "owner": "\u2014"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 18,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Printers intermittently stopping during production",
      "status": "Complete",
      "owner": "\u2014"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 19,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Need to spec out a way for the customer to combine serialized pallets",
      "status": "Complete",
      "owner": "\u2014",
      "notes": "Configuration of \"enforcecasescaninpalletize\" was not set to \"No\". BB set and tested."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 20,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Truck Diagram | Pulling item code instead of product code",
      "status": "Complete",
      "owner": "\u2014",
      "notes": "Verified that theTruck Diagram is pulling Item Code"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 21,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "When a partial tub is created at the scale via supervisor override, the barcode will show the correct data but the putin does not.",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "rm_reference": "13507"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 22,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Cannot combine WPL and BULK products produced to same order in Nimbus Pick Combine",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "rm_reference": "13506"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 23,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Case Mode not showing after period of inactivity",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "next_steps": "Need to test with scanner .86",
      "rm_reference": "13559"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 24,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "S9 - Not all orders show on Work Order Planner",
      "status": "Complete",
      "owner": "Debbie Kennedy",
      "rm_reference": "13565"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 25,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Device Connections Not Clearing - Consolidated Catfish",
      "status": "Complete",
      "owner": "Courtney Smith",
      "rm_reference": "13562"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 26,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Consolidated Catfish - S9 random log outs",
      "status": "Complete",
      "owner": "Courtney Smith",
      "rm_reference": "13492"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 27,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Nimbus Stalls Causing Initializing",
      "status": "Complete",
      "owner": "Courtney Smith",
      "rm_reference": "13480"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 28,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "SLC Produced More than Goal Target w/o Tolerance",
      "status": "Complete",
      "owner": "Help Desk",
      "rm_reference": "13510"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 29,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Pallet Created in Simple Scan Failed to Create Serials in Inven",
      "status": "Complete",
      "owner": "Debbie Kennedy",
      "rm_reference": "13509"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 30,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "S9 - Load Assignment - Searching for a load by date returns the wrong day?s data",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "next_steps": "Deployment",
      "rm_reference": "13487",
      "notes": "Projects testing passed .86"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 31,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Pick list showing duplicate and incorrect information",
      "status": "Complete",
      "owner": "Will James",
      "next_steps": "Test on .86",
      "rm_reference": "13481"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 32,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "S9 ? Snake Pattern Load Sequence",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "next_steps": "Deployment",
      "rm_reference": "13468",
      "notes": "Projects testing passed .86"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 33,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "S9 ? Display ?Mixed? for Mixed Item Code Pallets",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "next_steps": "Test on .86",
      "rm_reference": "13467"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 34,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Consolidated Catfish: BOL order qty incorrect",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "next_steps": "Test on .86",
      "rm_reference": "13453"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 35,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "S9 Nimbus - Reassign serial creation",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "next_steps": "Deployment",
      "rm_reference": "13436",
      "notes": "Projects testing passed .86"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 36,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "S9 - Add Item Code to Pick List Report",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "next_steps": "Test on .86",
      "rm_reference": "13402"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 37,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "S9 - BOL Update - Consolidated Catfish",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "next_steps": "Deployment",
      "rm_reference": "12721",
      "notes": "Projects testing passed .86"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 38,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "S9 - Order sent from ERP gets rejected",
      "status": "Complete",
      "owner": "Nate Fabian",
      "rm_reference": "13568",
      "notes": "LS found that the Q6 product has the same product code and item code but the productname is different. it looks like Consolidated's QERP referencing the productname instead of the item code."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 39,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Update the pick list report so that the included available inventory, include pallet number, and include picked inventory are automatically selected.",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "next_steps": "BB to speak with CC about how often they use this"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 40,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Send out the spare replacement RJ45 to DB9 adapters to CCP Team.",
      "status": "Complete",
      "notes": "RE shipped"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 41,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Update interface to allow for stop number to be populated on Load report",
      "status": "Complete",
      "notes": "StopSeq already in DB for interface. Sent email to CC advising of setup."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 42,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Case mode screen freezing issue on the scan gun after a period of inactivity",
      "status": "Complete",
      "owner": "Will James",
      "next_steps": "CFS to test on .86 with physical scanner in office",
      "notes": "CC reported that when using any scanner in a function that uses case mode; when the case mode check box is selected, box scanned, and left in the function for a extended period of inactivity, the case mode check box will disapper."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 43,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Customer has different box tares for the same product code but no way to change tares for same product",
      "status": "Complete",
      "owner": "Brandon Boutchyard",
      "notes": "Reach out to CC for clarification on how they use box tares for same products"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 44,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "When trying to credit back an unused whole pallet of WIP tubs into the cooler results in a message stating the pallet has been \"depleted\".",
      "status": "Complete",
      "notes": "It was found that CC had been scanning the pallet number that was originally putin to the batch instead of scanning the pallet that was credited after crediting the initial pallet."
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 45,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Tally scan issues on position five for the tally scan scanner on the left (27) and position three for the scanner on the right (28) in FLCooler",
      "status": "Complete",
      "owner": "Customer",
      "next_steps": "CCP Team will check the connection on position five for the tally scan scanner on the left (27) and position three for the scanner on the right (28) and report back on the connection status and performance.",
      "notes": "Sent email 2/9 for update"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 46,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "BOL shows a straight line on the signature line for each BOL",
      "status": "Complete",
      "owner": "Customer",
      "next_steps": "CCP Team will test the stylus on their side to confirm if it is the cause of the straight-line signature display on the bill of lading",
      "notes": "Sent email 2/9 for update"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 47,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "Some order files are being rejected",
      "status": "Complete",
      "owner": "Customer",
      "notes": "It was found the last time an order was rejected that the quantity for a line item showed .00000 instead of a whole 0. Marked resolved per email from Tony 02/11"
    }
  },
  {
    "source_file": "Consolidated_Catfish_-_Issue_Tracker.xlsx",
    "source_sheet": "Archive",
    "source_row": 48,
    "imported_at": "2025-06-01T00:00:00Z",
    "raw_record": {
      "customer_name": "Consolidated Catfish",
      "topic": "When changes are made to orders, the quantities changed do not reflect on the SLC",
      "status": "Complete",
      "owner": "Customer",
      "next_steps": "CCP Team will keep a list of orders that are having issues with quantity changes not updating the SLC",
      "notes": "Sent email 2/9 for update"
    }
  }
];
