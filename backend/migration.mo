import UserApproval "user-approval/approval";

module {
  type OldActor = {
    userApprovalState : UserApproval.UserApprovalState;
  };

  type NewActor = {
    userApprovalState : UserApproval.UserApprovalState;
  };

  public func run(old : OldActor) : NewActor {
    { old with userApprovalState = old.userApprovalState };
  };
};
