import { protobind } from ".";

describe("protobind", () => {
  it("should bind all methods within a class", () => {
    class BasicClass {
      _name: string;
      constructor(name) {
        this._name = name;
        protobind(this);
      }

      foo() {
        return `Hello, my name is ${this._name}`;
      }

      bar() {
        return this.foo().toUpperCase();
      }
    }

    const { foo, bar } = new BasicClass("test");
    expect(foo()).toBe("Hello, my name is test");
    expect(bar()).toBe("HELLO, MY NAME IS TEST");
  });

  it("should bind all inherited methods for a class", () => {
    class BaseClass {
      _name: string;
      constructor(name) {
        this._name = name;
      }

      foo() {
        return `Hello, my name is ${this._name}`;
      }
    }

    class ExtendedClass extends BaseClass {
      bar() {
        return this.foo().toLowerCase();
      }
    }

    class TestClass extends ExtendedClass {
      constructor(name: string) {
        super(name);
        protobind(this);
      }

      baz() {
        return this.foo().toUpperCase();
      }
    }

    const { foo, bar, baz } = new TestClass("test");
    expect(foo()).toBe("Hello, my name is test");
    expect(bar()).toBe("hello, my name is test");
    expect(baz()).toBe("HELLO, MY NAME IS TEST");
  });

  it("should bind all methods within a class that uses the decorator", () => {
    class BaseClass {
      _name: string;
      constructor(name) {
        this._name = name;
      }

      foo() {
        return `Hello, my name is ${this._name}`;
      }
    }

    class ExtendedClass extends BaseClass {
      bar() {
        return this.foo().toLowerCase();
      }
    }

    @protobind
    // @ts-ignore
    // Since we exclude test files from compilation, we get a warning here about enabling
    // experimental decorators. We can ignore this warning, because ts-jest will use the 
    // 'compilerOptions' from tsconfig when it processes our tests.
    class TestClass extends ExtendedClass {
      constructor(name: string) {
        super(name);
      }

      baz() {
        return this.foo().toUpperCase();
      }
    }

    const { foo, bar, baz } = new TestClass("test");
    expect(foo()).toBe("Hello, my name is test");
    expect(bar()).toBe("hello, my name is test");
    expect(baz()).toBe("HELLO, MY NAME IS TEST");
  });
});
