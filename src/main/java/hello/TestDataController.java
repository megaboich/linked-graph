package hello;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
public class TestDataController {

    @RequestMapping("/testdata")
    public List<Triple> testdata(@RequestParam(value="name", defaultValue="") String name) {

        List<Triple> list = new ArrayList<Triple>();
        list.add(new Triple("John Smith", "plays", "Cricket"));
        list.add(new Triple("John Smith", "dislikes", "Insects"));
        list.add(new Triple("Cricket", "is a", "Sport"));

        list.add(new Triple("Test", "contains", "Data"));
        list.add(new Triple("Data", "contains", "MoreData"));

        return list;
    }
}