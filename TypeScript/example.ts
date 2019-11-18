
//error：--------------------------------------------------
const props = {
    foo: "bar"
};

props["foo"] = "baz"; // Element implicitly has an 'any' type because expression of type 'string' can't be used to index type
//--------------------------------------------------


//right：--------------------------------------------------
interface Props {
    foo: string;
    [key: string]: Props[keyof Props];
}

const props: Props = {
    foo: "bar"
};

props["foo"] = "baz"; // ok
props["bar"] = "baz"; // error
  //--------------------------------------------------
