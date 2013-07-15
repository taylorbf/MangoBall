//
//  ViewController.m
//  MangoBall
//
//  Created by Benjamin Taylor on 7/1/13.
//  Copyright (c) 2013 Benjamin Taylor. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    [_viewWeb setBackgroundColor:[UIColor colorWithRed:0.0 green:0.0 blue:0.0 alpha:1.0]];
    [_viewWeb setOpaque:NO];
 
   /*
    NSString *fullURL = @"http://www.whitechord.org";
    NSURL *url = [NSURL URLWithString:fullURL];
    NSURLRequest *requestObj = [NSURLRequest requestWithURL:url];
    [_viewWeb loadRequest:requestObj];
  */
    
    NSString*path = [[NSBundle mainBundle] pathForResource:@"nexusMango" ofType:@"html" inDirectory:@"WebApp"];
    NSURL*url= [NSURL fileURLWithPath:path];
    [_viewWeb loadRequest:[NSURLRequest requestWithURL:url]];
    
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
