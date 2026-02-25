import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

module {
  // Type definitions for types before migration (without clientPrincipal field)
  type OldToDoItem = {
    id : Nat;
    title : Text;
    description : Text;
    status : {
      #pending;
      #inProgress;
      #completed;
    };
    priority : {
      #low;
      #medium;
      #high;
    };
    assignedClient : ?Principal;
    createdAt : Time.Time;
  };

  type OldTimelineEntry = {
    id : Nat;
    title : Text;
    description : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    taskReference : ?Nat;
    status : {
      #planned;
      #inProgress;
      #completed;
    };
  };

  type OldFollowUpItem = {
    id : Nat;
    title : Text;
    description : Text;
    dueDate : Time.Time;
    clientReference : ?Principal;
    status : {
      #pending;
      #completed;
    };
    notes : Text;
  };

  type OldDeadlineRecord = {
    id : Nat;
    title : Text;
    description : Text;
    dueDate : Time.Time;
    deliverableReference : ?Nat;
    urgencyLevel : {
      #high;
      #medium;
      #low;
    };
    status : {
      #active;
      #completed;
      #missed;
    };
  };

  // New types for migration (including clientPrincipal field)
  type NewToDoItem = {
    id : Nat;
    title : Text;
    description : Text;
    status : {
      #pending;
      #inProgress;
      #completed;
    };
    priority : {
      #low;
      #medium;
      #high;
    };
    assignedClient : ?Principal;
    createdAt : Time.Time;
    clientPrincipal : ?Principal;
  };

  type NewTimelineEntry = {
    id : Nat;
    title : Text;
    description : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    taskReference : ?Nat;
    status : {
      #planned;
      #inProgress;
      #completed;
    };
    clientPrincipal : ?Principal;
  };

  type NewFollowUpItem = {
    id : Nat;
    title : Text;
    description : Text;
    dueDate : Time.Time;
    clientReference : ?Principal;
    status : {
      #pending;
      #completed;
    };
    notes : Text;
    clientPrincipal : ?Principal;
  };

  type NewDeadlineRecord = {
    id : Nat;
    title : Text;
    description : Text;
    dueDate : Time.Time;
    deliverableReference : ?Nat;
    urgencyLevel : {
      #high;
      #medium;
      #low;
    };
    status : {
      #active;
      #completed;
      #missed;
    };
    clientPrincipal : ?Principal;
  };

  public func run(old : {
    // Other state fields remain unchanged
    toDoItems : Map.Map<Nat, OldToDoItem>;
    timelineEntries : Map.Map<Nat, OldTimelineEntry>;
    followUpItems : Map.Map<Nat, OldFollowUpItem>;
    deadlineRecords : Map.Map<Nat, OldDeadlineRecord>;
  }) : {
    toDoItems : Map.Map<Nat, NewToDoItem>;
    timelineEntries : Map.Map<Nat, NewTimelineEntry>;
    followUpItems : Map.Map<Nat, NewFollowUpItem>;
    deadlineRecords : Map.Map<Nat, NewDeadlineRecord>;
  } {
    let toDoItems = old.toDoItems.map<Nat, OldToDoItem, NewToDoItem>(
      func(_id, oldItem) {
        // Preserve assignedClient as clientPrincipal so existing admin-assigned
        // items remain visible to the assigned client in getMyToDos queries.
        { oldItem with clientPrincipal = oldItem.assignedClient };
      }
    );

    let timelineEntries = old.timelineEntries.map<Nat, OldTimelineEntry, NewTimelineEntry>(
      func(_id, oldItem) {
        { oldItem with clientPrincipal = null };
      }
    );

    let followUpItems = old.followUpItems.map<Nat, OldFollowUpItem, NewFollowUpItem>(
      func(_id, oldItem) {
        // Preserve clientReference as clientPrincipal so existing admin-created
        // follow-ups remain visible to the referenced client in getMyFollowUps queries.
        { oldItem with clientPrincipal = oldItem.clientReference };
      }
    );

    let deadlineRecords = old.deadlineRecords.map<Nat, OldDeadlineRecord, NewDeadlineRecord>(
      func(_id, oldItem) {
        { oldItem with clientPrincipal = null };
      }
    );

    {
      toDoItems;
      timelineEntries;
      followUpItems;
      deadlineRecords;
    };
  };
};
