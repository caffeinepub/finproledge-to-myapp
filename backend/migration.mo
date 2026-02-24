import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldPaymentMethod = {
    #paypal;
    #stripe;
  };

  type OldPaymentRecord = {
    id : Nat;
    client : Principal;
    amount : Nat;
    currency : Text;
    paymentMethod : OldPaymentMethod;
    status : {
      #pending;
      #completed;
      #failed;
    };
    timestamp : Time.Time;
  };

  type OldAdminPaymentAccounts = {
    paypalEmail : Text;
    stripeAccountId : Text;
  };

  type OldActor = {
    paymentRecords : Map.Map<Nat, OldPaymentRecord>;
    adminPaymentAccounts : ?OldAdminPaymentAccounts;
  };

  type NewPaymentMethod = {
    #paypal;
    #creditCard;
    #debitCard;
    #applePay;
    #googlePay;
  };

  type NewPaymentRecord = {
    id : Nat;
    client : Principal;
    amount : Nat;
    currencyCode : Text;
    paymentMethod : NewPaymentMethod;
    cardType : ?Text;
    status : {
      #pending;
      #completed;
      #failed;
    };
    timestamp : Time.Time;
  };

  type NewAdminPaymentSettings = {
    paypalEmail : Text;
  };

  type NewActor = {
    paymentRecords : Map.Map<Nat, NewPaymentRecord>;
    adminPaymentSettings : ?NewAdminPaymentSettings;
  };

  public func run(old : OldActor) : NewActor {
    let newPaymentRecords = old.paymentRecords.map<Nat, OldPaymentRecord, NewPaymentRecord>(
      func(_id, oldRecord) {
        {
          oldRecord with
          currencyCode = oldRecord.currency;
          paymentMethod = #paypal;
          cardType = null;
        };
      }
    );

    let newAdminPaymentSettings = switch (old.adminPaymentAccounts) {
      case (null) { null };
      case (?oldAccounts) { ?{ paypalEmail = oldAccounts.paypalEmail } };
    };

    {
      paymentRecords = newPaymentRecords;
      adminPaymentSettings = newAdminPaymentSettings;
    };
  };
};
