import Array "mo:base/Array";

actor HelloWorld {
    var submittedNames: [Text] = [];

    public shared(msg) func greet(name: Text) : async Text {
        submittedNames := Array.append(submittedNames, [name]);
        return "Hello, " # name # "!";
    };

    public query func getSubmittedNames() : async [Text] {
        return submittedNames;
    };
};