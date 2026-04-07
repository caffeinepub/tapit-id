import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Persistent authentication system state provided by mixin.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Profile type definition.
  public type Profile = {
    firstName : Text;
    lastName : Text;
    jobTitle : Text;
    company : Text;
    email : Text;
    phone : Text;
    website : Text;
    address : {
      street : Text;
      city : Text;
      state : Text;
      zip : Text;
      country : Text;
    };
    socialLinks : {
      linkedin : Text;
      twitter : Text;
      instagram : Text;
      facebook : Text;
    };
    bio : Text;
    hasPets : Bool;
    hasElderlyLovedOnes : Bool;
  };

  public type ProfileRecord = {
    profile : Profile;
    timestamp : Time.Time;
  };

  let profiles = Map.empty<Text, ProfileRecord>();
  let profileHistory = Map.empty<Text, [ProfileRecord]>();
  let profileOwners = Map.empty<Text, Principal>();

  // Helper function to check if caller owns a profile or is admin
  private func isOwnerOrAdmin(caller : Principal, phone : Text) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    switch (profileOwners.get(phone)) {
      case (?owner) { Principal.equal(caller, owner) };
      case (null) { false };
    };
  };

  public query ({ caller }) func getProfile(phone : Text) : async ?ProfileRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(phone);
  };

  public query ({ caller }) func getProfileHistory(phone : Text) : async [ProfileRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profile history");
    };
    switch (profileHistory.get(phone)) {
      case (?h) { h };
      case (null) { [] };
    };
  };

  public query ({ caller }) func listProfiles() : async [ProfileRecord] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can list profiles");
    };
    profiles.values().toArray();
  };

  public shared ({ caller }) func createOrReplaceProfile(phone : Text, profile : Profile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };

    // Check ownership: only owner or admin can replace existing profile
    let existingOwner = profileOwners.get(phone);
    switch (existingOwner) {
      case (?owner) {
        if (not Principal.equal(caller, owner) and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the profile owner or admin can replace this profile");
        };
      };
      case (null) {
        // New profile - set caller as owner
        profileOwners.add(phone, caller);
      };
    };

    let profileRecord : ProfileRecord = {
      profile;
      timestamp = Time.now();
    };

    // Add current profile to history if exists.
    switch (profiles.get(phone)) {
      case (?currentProfile) {
        let existingHistory = switch (profileHistory.get(phone)) {
          case (?h) { h };
          case (null) { [] };
        };
        let newHistory = existingHistory.concat([currentProfile].values().toArray());
        profileHistory.add(phone, newHistory);
      };
      case (null) {};
    };

    profiles.add(phone, profileRecord);
  };

  public shared ({ caller }) func deleteProfile(phone : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete profiles");
    };
    if (not profiles.containsKey(phone)) {
      Runtime.trap("Profile does not exist");
    };
    if (not isOwnerOrAdmin(caller, phone)) {
      Runtime.trap("Unauthorized: Only the profile owner or admin can delete this profile");
    };
    profiles.remove(phone);
    profileHistory.remove(phone);
    profileOwners.remove(phone);
  };

  public query ({ caller }) func getProfileCount() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profile count");
    };
    profiles.size();
  };

  public query ({ caller }) func searchProfilesByName(name : Text) : async [ProfileRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can search profiles");
    };
    profiles.values().toArray().filter(
      func(record) {
        record.profile.firstName.contains(#text name) or record.profile.lastName.contains(#text name);
      }
    );
  };

  public query ({ caller }) func searchProfilesByCompany(company : Text) : async [ProfileRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can search profiles");
    };
    profiles.values().toArray().filter(
      func(record) {
        record.profile.company.contains(#text company);
      }
    );
  };

  public query ({ caller }) func getProfilesWithPets() : async [ProfileRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.values().toArray().filter(
      func(record) {
        record.profile.hasPets;
      }
    );
  };

  public query ({ caller }) func getProfilesWithElderlyLovedOnes() : async [ProfileRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.values().toArray().filter(
      func(record) {
        record.profile.hasElderlyLovedOnes;
      }
    );
  };

  public type ProfileFilter = {
    firstNameContains : ?Text;
    companyContains : ?Text;
    hasPets : ?Bool;
    hasElderlyLovedOnes : ?Bool;
  };

  public query ({ caller }) func getFilteredProfiles(filter : ProfileFilter) : async [ProfileRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can filter profiles");
    };
    profiles.values().toArray().filter(
      func(record) {
        switch (filter.firstNameContains) {
          case (?name) {
            if (not record.profile.firstName.contains(#text name)) { return false };
          };
          case (null) {};
        };
        switch (filter.companyContains) {
          case (?company) {
            if (not record.profile.company.contains(#text company)) { return false };
          };
          case (null) {};
        };
        switch (filter.hasPets) {
          case (?hasPets) {
            if (record.profile.hasPets != hasPets) { return false };
          };
          case (null) {};
        };
        switch (filter.hasElderlyLovedOnes) {
          case (?hasElderlyLovedOnes) {
            if (record.profile.hasElderlyLovedOnes != hasElderlyLovedOnes) {
              return false;
            };
          };
          case (null) {};
        };
        true;
      }
    );
  };

  public shared ({ caller }) func deleteAllProfiles() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete all profiles");
    };
    Runtime.trap("Restore Mode: Dead End");
  };

  // --------------------------
  // Share Back Feature
  // --------------------------

  public type ShareBackInput = {
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
  };

  public type ShareBack = {
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    timestamp : Time.Time;
  };

  let sharebacks = Map.empty<Text, [ShareBack]>();

  public shared ({ caller }) func submitShareBack(ownerPhone : Text, input : ShareBackInput) : async () {
    let newShareBack : ShareBack = {
      input with
      timestamp = Time.now();
    };

    let existingShareBacks = switch (sharebacks.get(ownerPhone)) {
      case (?s) { s };
      case (null) { [] };
    };

    let newShareBacks = existingShareBacks.concat([newShareBack].values().toArray());
    sharebacks.add(ownerPhone, newShareBacks);
  };

  public query ({ caller }) func getShareBacks(ownerPhone : Text) : async [ShareBack] {
    if (not isOwnerOrAdmin(caller, ownerPhone)) {
      Runtime.trap("Unauthorized: Only the profile owner or admin can view these share backs");
    };
    switch (sharebacks.get(ownerPhone)) {
      case (?s) { s };
      case (null) { [] };
    };
  };
};
