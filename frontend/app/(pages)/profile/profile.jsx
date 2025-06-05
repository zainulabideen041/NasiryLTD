import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const profile = ({ user }) => {
  console.log(user);

  return (
    <div className="flex flex-wrap justify-center items-center">
      <div className="flex md:flex-1 justify-center m-5 md:m-10 h-40 md:h-70">
        <Avatar className="h-full w-[80%]">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>N</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex md:flex-3 flex-col items-center">
        <div className="flex w-full flex-wrap justify-around m-5">
          <div className="p-4 md:p-1">
            <Label
              htmlFor="email"
              className="text-lg md:text-xl mb-2 font-bold"
            >
              Name
            </Label>
            <Input
              type="name"
              id="name"
              placeholder="Enter your Name"
              value={user.name}
              // onChange={onChange}
              className="text-lg md:text-xl p-5 w-60 md:w-100"
              disabled
            />
          </div>
          <div className="p-4 md:p-1">
            <Label
              htmlFor="email"
              className="text-lg md:text-xl mb-2 font-bold"
            >
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your Email Address"
              value={user.email}
              // onChange={onChange}
              className="text-lg md:text-xl p-5 w-60 md:w-100"
              disabled
            />
          </div>
        </div>
        <div className="flex w-full flex-wrap justify-around items-center m-5">
          <div className="p-4 md:p-1">
            <Label
              htmlFor="phone"
              className="text-lg md:text-xl mb-2 font-bold"
            >
              Phone
            </Label>
            <Input
              type="phone"
              id="phone"
              value="07926154379"
              className="text-lg md:text-xl p-5 w-60 md:w-100"
              disabled
            />
          </div>
          <div className="p-4 md:p-1">
            <Label
              htmlFor="password"
              className="text-lg md:text-xl mb-2 font-bold"
            >
              Password
            </Label>
            <Input
              type="password"
              id="password"
              value="*********"
              className="text-lg md:text-xl p-5 w-60 md:w-100"
              disabled
            />
          </div>
        </div>
        {/* <Button className="w-50 mt-4 text-lg font-bold bg-[var(--ring)] hover:bg-green-800 hover:cursor-pointer text-white">
          Update
        </Button> */}
      </div>
    </div>
  );
};

export default profile;
