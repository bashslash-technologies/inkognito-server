const Utils = require("../src/broker/utility");


describe("Utility tests", () => {
  const password = "inkognito-appplication-programming-interface";
  const keyword = "inkognito";
  let hash;
  let cipher;

  //tests the code generation method
  // it('generates a 5 digit verification code', () => {
  //     let code = Utils.generateCode();
  //     expect(code.length).toBe(5);
  // });

  //tests for hashing the password
  it("generates a hash for the password", async () => {
    hash = await Utils.hashPassword(password);
  });

  //tests for comparinng the hashed password and password
  it("compares the passwords", async () => {
    let isSame = await Utils.comparePasswords({ password, hash });
    expect(isSame).toBe(true);
  });

  //tests for generating cipher
  it("generates a cipher", async () => {
    let obj = {
      payload: {
        name: "Domey Benjamin",
        email: "domeybenjamin1@gmail.com",
        gender: "Male",
      },
    };

    cipher = await Utils.generateCipher(obj);
  });

  //decripts the cipher
  it("verifies the cipher and return my obj", async () => {
    let payload = await Utils.validateCipher({
      token: cipher,
    });

    expect(payload).toMatchObject({
      name: "Domey Benjamin",
      email: "domeybenjamin1@gmail.com",
      gender: "Male",
    });
  });

  // deletes file
  // it('deletes the file passed to it', () => {
  //   let a = Utils.deleteFile(`${__dirname}/hello.txt`);
  //   expect(a).toBe(true);
  // });

  // create a folder
  // it('creates a folder if the folder does not exists', async () => {
  //   let created = await Utils.makeDirectory(`${__dirname}/../src/Uploads`);
  //   expect(created).toBe(true);
  // });
});
