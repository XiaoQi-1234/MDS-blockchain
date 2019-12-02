package com.blockchain.controller;

import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;



@Controller
@CrossOrigin
public class indexController {
	@RequestMapping("/index")
	public String index(HttpServletRequest req) {
		return "index.html";
		
	}
	@RequestMapping("/newAccount")
	public String newAccount(HttpServletRequest req) {
		return "newAccount.html";
		
	}
	@RequestMapping("/query")
	public String query(HttpServletRequest req) {
		return "query.html";
		
	}	
	@RequestMapping("/remove")
	public String remove(HttpServletRequest req) {
		return "remove.html";
		
	}
	@RequestMapping("/build")
	@CrossOrigin
	public String build(HttpServletRequest req) {
		return "build.html";
		
	}
	@RequestMapping("/lastblock")
	public String lastblock(HttpServletRequest req) {
		return "lastblock.html";
		
	}
	
}
