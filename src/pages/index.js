import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  VStack,
  useToast,
  useCallbackRef,
} from "@chakra-ui/react";
import Header from "../components/header";
import api from "../services/api";

export default function Home() {
  const [uId, setUid] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [id, setId] = useState(null);
  const [clients, setClients] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidFormData = () => {
    if (!uId) {
      return toast({
        title: "Fill In The ID Field!!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (!fname) {
      return toast({
        title: "Fill In The First Name Field!!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (!lname) {
      return toast({
        title: "Fill In The Last Name Field!!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (!email) {
      return toast({
        title: "Fill In The E-mail Field!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (!phone) {
      return toast({
        title: "Fill In The Phone Field!!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (!address) {
      return toast({
        title: "Fill In The Address Field!!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    if (clients.some((client) => client.email === email && client._id !== id)) {
      return toast({
        title: "Not an E-mail!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSubmitCreateClient = async (e) => {
    e.preventDefault();

    if (isValidFormData()) return;
    try {
      setIsLoading(true);
      const { data } = await api.post("/clients", { uId, fname, lname, email, phone, address });
      setClients(clients.concat(data.data));
      setUid("");
      setFname("");
      setLname("");
      setEmail("");
      setPhone("");
      setAddress("");
      setIsFormOpen(!isFormOpen);
      toast({
        title: "Register Success!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      api.get("/clients").then(({ data }) => {
        setClients(data.data);
      })
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (_id) => {
    try {
      await api.delete(`clients/${_id}`);
      api.get("/clients").then(({ data }) => {
        setClients(data.data);
      })
      toast({
        title: "Delete Success!",
        status: "info",
        duration: 9000,
        isClosable: true,
      });
      
    } catch (error) {
      console.log(error);
    }
  };

  const handlShowUpdateClient = (client) => {
    setId(client._id);
    setUid(client.uId);
    setFname(client.fname);
    setLname(client.lname);
    setEmail(client.email);
    setPhone(client.phone);
    setAddress(client.address);
    setIsFormOpen(true);
  };

  const handleUpdateClient = async (e) => {
    e.preventDefault();

    if (isValidFormData()) return;

    try {
      setIsLoading(true);
      await api.put(`clients/${id}`, { uId, fname, lname, email, phone, address });
      setUid("");
      setFname("");
      setLname("");
      setEmail("");
      setPhone("");
      setAddress("");
      setId(null);
      setIsFormOpen(!isFormOpen);

      toast({
        title: "Update Success!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      api.get("/clients").then(({ data }) => {
        setClients(data.data);
      })
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const toast = useToast();
  
  useEffect(() => {
    [
      api.get("/clients").then(({ data }) => {
        setClients(data.data);
      }),
    ];
  }, [clients.whenToUpdateValue]);

  return (
    <Box>
      <Header />
      <Flex align="center" justifyContent="center">
        <Box
          width={800}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
          p={20}
          mt="25"
        >
          <Flex justifyContent="flex-end">
            <Button
              colorScheme="blue"
              onClick={() => setIsFormOpen(!isFormOpen)}
            >
              {isFormOpen ? "-" : "+"}
            </Button>
          </Flex>

          {isFormOpen ? (
            <VStack
              as="form"
              onSubmit={id ? handleUpdateClient : handleSubmitCreateClient}
            >
              <FormControl>
                <FormLabel>ID</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter ID Name"
                  onChange={(e) => setUid(e.target.value)}
                  value={uId}
                />
              </FormControl>

              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter First Name"
                  onChange={(e) => setFname(e.target.value)}
                  value={fname}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter Last Name"
                  onChange={(e) => setLname(e.target.value)}
                  value={lname}
                />
              </FormControl>

              <FormControl mt={5}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter E-mail"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter Phone"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter Address"
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                />
              </FormControl>

              <Button
                colorScheme="blue"
                type="submit"
                mt={6}
                isLoading={isLoading}
              >
                {id ? "Update" : "Register"}
              </Button>
            </VStack>
          ) : null}

          <Table variant="simple" mt={6}>
            <Thead bgColor="blue">
              <Tr>
                <Th textColor="white">ID</Th>
                <Th textColor="white">First Name</Th>
                <Th textColor="white">Email</Th>
                <Th textColor="white">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {clients.map((client, index) => (
                <Tr key={index}>
                  <Td>{client.uId}</Td>
                  <Td>{client.fname}</Td>
                  <Td>{client.email}</Td>
                  <Td justifyContent="space-between">
                    <Flex>
                      <Button
                        size="sm"
                        fontSize="small"
                        colorScheme="yellow"
                        mr="2"
                        onClick={() => handlShowUpdateClient(client)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        fontSize="small"
                        colorScheme="red"
                        mr="2"
                        onClick={() => handleDeleteClient(client._id)}
                      >
                        Remove
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );
}
