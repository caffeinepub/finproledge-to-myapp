module {
  type OldActor = { /* old state */ };
  type NewActor = { /* new state */ };

  // Identity migration as there are no breaking state changes.
  public func run(old : OldActor) : NewActor {
    old;
  };
};
